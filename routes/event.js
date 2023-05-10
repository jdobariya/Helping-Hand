import { Router } from "express";
import * as validation from "../validation.js";
import { eventData } from "../data/index.js";
import { userData } from "../data/index.js";
import multer from "multer";
import xss from "xss";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    const err = new Error("Only .png, .jpg and .jpeg format allowed!");
    err.name = "ExtensionError";
    return cb(err);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.route("/create").get(async (req, res) => {
  try {
    if (req.session.isHost) {
      return res.render("create_event", {
        title: "Create Event",
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    } else {
      if (req.session && req.session.loggedIn)
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      else
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: false,
        });
    }
  } catch (e) {
    if (req.session && req.session.loggedIn)
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    else
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: false,
      });
  }
});
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
router.post("/create", upload.array("event_images", 10), async (req, res) => {
  try {
    if (req.xhr) {
      if (req.session.isHost) {
        const userId = req.session.user_id;
        const userInfo = await userData.getUserById(userId);

        let eventName = validation.isValidString(req.body.event_name);
        eventName = xss(eventName);
        let description = validation.isValidString(req.body.description);
        description = xss(description);
        let application_deadline = validation.isValidEventTime(
          parseInt(req.body.application_deadline)
        );
        let host_time = validation.isValidEventTime(
          parseInt(req.body.host_time)
        );
        let streetAddress = validation.isValidString(req.body.streetAddress);
        streetAddress = xss(streetAddress);
        let city = validation.isValidString(req.body.city);
        city = xss(city);
        let state = validation.isValidString(req.body.state);
        let zipcode = validation.isValidString(req.body.zipcode);
        let image_url = [];

        for (let i = 0; i < req.files.length; i++) {
          image_url.push(req.files[i].path);
        }

        if (host_time < application_deadline)
          throw "Error: Event Date & Time should be after Registration Deadline";

        const hostInfo = {
          host_id: userId,
          host_name: userInfo.first_name + " " + userInfo.last_name,
          contact: userInfo.email,
        };

        hostInfo.host_name = toTitleCase(hostInfo.host_name);
        const location = {
          address: streetAddress,
          city: city,
          state: state,
          zipcode: zipcode,
        };

        const event = await eventData.addEvent(
          eventName,
          description,
          application_deadline,
          host_time,
          location,
          hostInfo,
          image_url
        );
        return res.status(200).json({ success: true, event_id: event._id });
      }
    } else {
      if (req.session && req.session.loggedIn)
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      else
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: false,
        });
    }
  } catch (e) {
    return res.json({ success: false, error: e });
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    let eventDetail = await eventData.getEventByEventId(req.params.id);

    eventDetail.isRegistrationExpired = false;
    if (
      new Date(eventDetail.application_deadline).getTime() -
        new Date().getTime() <
      0
    ) {
      eventDetail.isRegistrationExpired = true;
    }
    eventDetail.isEventExpired = false;

    if (new Date(eventDetail.host_time).getTime() - new Date().getTime() < 0) {
      eventDetail.isEventExpired = true;
    }

    const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    eventDetail["etime"] = longEnUSFormatter.format(
      new Date(eventDetail.host_time)
    );
    eventDetail.host_time = eventDetail.etime;

    eventDetail.application_deadline = longEnUSFormatter
      .format(new Date(eventDetail.application_deadline))
      .toString();
    let isRegistered = false;

    if (req.session && req.session.loggedIn) {
      let userId = req.session.user_id;
      let eventHostUser = eventDetail.host_info.host_id;

      if (eventDetail.volunteers.includes(userId)) isRegistered = true;

      if (userId === eventHostUser) {
        let volunteers = [];
        let eventVolunteer = eventDetail.volunteers;
        try {
          for (let i = 0; i < eventVolunteer.length; i++) {
            let user = await userData.getUserById(eventVolunteer[i]);
            volunteers[eventVolunteer[i]] = {
              first_name: user.first_name,
              last_name: user.last_name,
              contact: user.contact,
              email: user.email,
            };
          }
        } catch (e) {
          console.log(e);
        }

        return res.render("event", {
          title: "Event Details",
          event: eventDetail,
          isHost: true,
          user: true,
          first_name: req.session.first_name,
          volunteerList: volunteers,
          volunteersCount: Object.keys(volunteers).length,
          isRegistered,
        });
      } else {
        return res.render("event", {
          title: "Event Details",
          event: eventDetail,
          isHost: false,
          user: true,
          first_name: req.session.first_name,
          isRegistered,
        });
      }
    } else {
      return res.render("event", {
        title: "Event Details",
        event: eventDetail,
        isHost: false,
        user: false,
        isRegistered,
      });
    }
  } catch (e) {
    if (req.session && req.session.loggedIn)
      res.status(404).render("error", {
        title: "Error",
        error: 404,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    else
      res.status(404).render("error", {
        title: "Error",
        error: 404,
        user: false,
      });
  }
});

router.route("/:id").patch(async (req, res) => {
  try {
    if (req.xhr) {
      if (req.body.reqType === "register") {
        let updatedEventDetail = await eventData.addVolunteers(
          req.params.id,
          req.session.user_id
        );
        if (updatedEventDetail) res.status(200).json({ success: true });
      } else if (req.body.reqType === "unregister") {
        let updatedEventDetail = await eventData.removeVolunteerToEvent(
          req.params.id,
          req.session.user_id
        );
        if (updatedEventDetail) res.status(200).json({ success: true });
      }
    }
  } catch (e) {
    if (req.session && req.session.loggedIn)
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    else
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: false,
      });
  }
});

router.route("/edit/:id").get(async (req, res) => {
  try {
    if (req.session.isHost) {
      const eventId = req.params.id;
      const userId = req.session.user_id;
      let eventDetail = await eventData.getEventByEventId(req.params.id);

      if (eventDetail.host_info.host_id === userId) {
        return res.render("edit_event", {
          title: "Edit Event",
          event: eventDetail,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      } else {
        if (req.session && req.session.loggedIn)
          res.status(403).render("error", {
            title: "Error",
            error: 403,
            user: true,
            first_name: req.session.first_name,
            isHost: req.session.isHost,
          });
        else
          res.status(403).render("error", {
            title: "Error",
            error: 403,
            user: false,
          });
      }
    } else {
      if (req.session && req.session.loggedIn)
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      else
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: false,
        });
    }
  } catch (e) {
    if (req.session && req.session.loggedIn)
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    else
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: false,
      });
  }
});

router.route("/edit/:id").patch(async (req, res) => {
  try {
    if (req.session.isHost) {
      const eventId = req.params.id;
      const userId = req.session.user_id;
      let eventDetail = await eventData.getEventByEventId(req.params.id);

      if (eventDetail.host_info.host_id === userId) {
        let description = validation.isValidString(req.body.description);
        let application_deadline = validation.isValidEventTime(
          parseInt(req.body.application_deadline)
        );
        let host_time = validation.isValidEventTime(
          parseInt(req.body.host_time)
        );
        let streetAddress = validation.isValidString(req.body.streetAddress);
        let city = validation.isValidString(req.body.city);
        let state = validation.isValidString(req.body.state);
        let zipcode = validation.isValidString(req.body.zipcode);

        if (host_time < application_deadline)
          throw "Error: Event Date & Time should be after Registration Deadline";

        eventDetail.description = description;
        eventDetail.application_deadline = application_deadline;
        eventDetail.host_time = host_time;
        eventDetail.location = {
          address: streetAddress,
          city: city,
          state: state,
          zipcode: zipcode,
        };

        await eventData.updateEventPatch(eventId, eventDetail);

        res.json({ success: true });
      } else {
        if (req.session && req.session.loggedIn)
          res.status(403).render("error", {
            title: "Error",
            error: 403,
            user: true,
            first_name: req.session.first_name,
            isHost: req.session.isHost,
          });
        else
          res.status(403).render("error", {
            title: "Error",
            error: 403,
            user: false,
          });
      }
    } else {
      if (req.session && req.session.loggedIn)
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      else
        res.status(403).render("error", {
          title: "Error",
          error: 403,
          user: false,
        });
    }
  } catch (e) {
    return res.json({ success: false, error: e });
  }
});

router.route("/details/:id").get(async (req, res) => {
  try {
    if (req.xhr) {
      let eventId = req.params.id.trim();
      validation.isValidId(eventId);
      const event_details = await eventData.getEventByEventId(eventId);

      let user_details = {
        isUser: false,
      };
      if (req.session.user_id) {
        user_details = {
          isUser: true,
          user_id: req.session.user_id.trim(),
        };
      }

      res.json({ event_details: event_details, user_details: user_details });
    } else {
      if (req.session && req.session.loggedIn)
        res.status(404).render("error", {
          title: "Error",
          error: 404,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost,
        });
      else
        res.status(404).render("error", {
          title: "Error",
          error: 404,
          user: false,
        });
    }
  } catch (e) {
    if (req.session && req.session.loggedIn)
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost,
      });
    else
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: false,
      });
  }
});

router.route("/:id/story").post(async (req, res) => {
  try {
    if (req.session.loggedIn) {
      const eventId = req.params.id.trim();
      validation.isValidId(eventId);
      const userId = req.session.user_id.trim();
      validation.isValidId(userId);

      const event = await eventData.getEventByEventId(eventId);
      const isRegistered = event.volunteers.indexOf(userId);

      if (isRegistered !== -1) {
        let story = validation.isValidString(req.body.story);
        story = xss(story);
        validation.isValidStoryString(story);

        await eventData.upsertStory(eventId, userId, story);

        res.json({ success: true, story: story });
      } else {
        res.json({
          success: false,
          error: "You must be registered for this event to submit a story",
        });
      }
    } else {
      res.json({
        success: false,
        error: "You must be logged in to submit a story",
      });
    }
  } catch (e) {
    return res.json({ success: false, error: e });
  }
});

router.route("/:id/feedback").post(async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    validation.isValidId(eventId);

    let feedback = validation.isValidString(req.body.feedback);
    feedback = xss(feedback);
    validation.isValidFeedbackString(feedback);

    if (req.session.loggedIn) {
      const userId = req.session.user_id.trim();
      validation.isValidId(userId);

      await eventData.upsertLoggedInUserFeedback(eventId, userId, feedback);

      res.json({ success: true, feedback: feedback });
    } else {
      let first_name = validation.isValidString(req.body.first_name);
      validation.isValidName(first_name);

      let last_name = validation.isValidString(req.body.last_name);
      validation.isValidName(last_name);

      let email = validation.isValidString(req.body.email);
      validation.isValidEmail(email);

      const feedbackObj = {
        firstname: first_name,
        lastname: last_name,
        email: email,
        feedback_comment: feedback,
      };

      await eventData.addNonLoggedInUserFeedback(eventId, feedbackObj);

      res.json({ success: true });
    }
  } catch (e) {
    return res.json({ success: false, error: e });
  }
});

export default router;
