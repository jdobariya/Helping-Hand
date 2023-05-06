import { Router } from "express";
import * as validation from "../validation.js";
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

  eventDetail["etime"] = longEnUSFormatter.format(
    new Date(eventDetail.host_time)
  );
  eventDetail.host_time = eventDetail.etime;

  eventDetail.application_deadline = longEnUSFormatter
    .format(new Date(eventDetail.application_deadline))
    .toString();
  let isRegistered = false;
  if (req.session && req.session.loggedIn) {
    let user = req.session.user_id;
    let eventHostUser = eventDetail.host_info.host_id;

    if (eventDetail.volunteers.includes(user)) isRegistered = true;
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
        volunteersCount: Object.keys(volunteers).length,
        isRegistered,
      });
    } else {
      res.render("event", {
        title: "Event Details",
        event: eventDetail,
        isHost: false,
        user: true,
        first_name: req.session.first_name,
        isRegistered,
      });
    }
  } else {
    res.render("event", {
      title: "Event Details",
      event: eventDetail,
      isHost: false,
      user: false,
      isRegistered,
    });
  }
});

router.route("/:id").patch(async (req, res) => {
  if (req.body.reqType === "register") {
    try {
      let updatedEventDetail = await eventData.addVolunteerToEvent(
        req.params.id,
        req.session.user_id
      );

      if (updatedEventDetail) res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  } else if (req.body.reqType === "unregister") {
    try {
      let updatedEventDetail = await eventData.removeVolunteerToEvent(
        req.params.id,
        req.session.user_id
      );

      if (updatedEventDetail) res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }
});

router.route("/edit/:id").get(async (req, res) => {
  try{
    let isHost = req.session.isHost;
    
    if(!isHost) throw "Error: You are not a host";

    let eventDetail = await eventData.getEventByEventId(req.params.id);
    const host_id = req.session.user_id;

    if(eventDetail.host_info.host_id !== host_id) {
      throw `Error: host with ${host_id} id is not the host of the event`;
    }

    res.render("edit_event", {
      title: "Edit Event",
      event: eventDetail,
      user:true,
      first_name: req.session.first_name,
    });
  }catch(e){
    res.status(404).render("error");
  }
});

router.route("/edit/:id").patch(async (req, res) => {
  try{
    if(req.session.isHost){
      const eventId = req.params.id;
      const userId = req.session.user_id
      let eventDetail = await eventData.getEventByEventId(req.params.id);

      if(eventDetail.host_info.host_id === userId) {
        let description = validation.isValidString(req.body.description);
        let application_deadline = validation.isValidEventTime(parseInt(req.body.application_deadline));
        let host_time = validation.isValidEventTime(parseInt(req.body.host_time));
        let streetAddress = validation.isValidString(req.body.streetAddress);
        let city = validation.isValidString(req.body.city);
        let state = validation.isValidString(req.body.state);
        let zipcode = validation.isValidString(req.body.zipcode);
    
        if(host_time < application_deadline) throw "Error: Event Date & Time should be after Registration Deadline";
    
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
      }
      else{
        res.render("error");
      }
    }else{
      res.render("error");
    }
  }catch(e){
    res.json({ success: false, error: e });
  }
});

export default router;
