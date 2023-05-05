import { Router } from "express";
import {} from "../validation.js";
import { eventData } from "../data/index.js";
import { userData } from "../data/index.js";

const router = Router();

router.route("/:id").get(async (req, res) => {
  let eventDetail = await eventData.getEventByEventId(req.params.id);
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let eventDateAndTime = eventDetail.host_time.split(" ");
  let deadlineDateAndTime = eventDetail.application_deadline.split(" ");

  eventDetail["etime"] = longEnUSFormatter.format(
    new Date(eventDetail.host_time)
  );
  eventDetail.host_time =
    eventDetail.etime + " " + eventDateAndTime[1] + " " + eventDateAndTime[2];

  eventDetail.application_deadline =
    longEnUSFormatter
      .format(new Date(eventDetail.application_deadline))
      .toString() +
    " " +
    deadlineDateAndTime[1] +
    " " +
    deadlineDateAndTime[2];

  if (req.session && req.session.loggedIn) {
    let user = req.session.user_id;
    let eventHostUser = eventDetail.host_info.host_id;

    if (user === eventHostUser) {
      let volunteers = {};
      let eventVolunteer = eventDetail.volunteers;
      try {
        for (let i = 0; i <= eventVolunteer.length; i++) {
          let user = await userData.getUserById(eventVolunteer[i]);
          volunteers[eventVolunteer[i]] = {
            first_name: user.first_name,
            last_name: user.last_name,
            contact: user.contact,
            email: user.email,
          };
        }
      } catch {
        console.log("something went wrong");
      }

      res.render("event", {
        title: "Event Details",
        event: eventDetail,
        isHost: true,
        user: true,
        first_name: req.session.first_name,
        volunteerList: volunteers,
      });
    } else {
      res.render("event", {
        title: "Event Details",
        event: eventDetail,
        isHost: false,
        user: true,
        first_name: req.session.first_name,
      });
    }
  } else {
    res.render("event", {
      title: "Event Details",
      event: eventDetail,
      isHost: false,
      user: false,
    });
  }
});

export default router;
