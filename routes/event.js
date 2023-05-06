import { Router } from "express";
import * as validation from "../validation.js";
import { eventData } from "../data/index.js";

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

  res.render("event", {
    title: "Event Details",
    event: eventDetail,
  });
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
    const eventId = req.params.id;
    const userId = req.session.user_id
    let description = validation.isValidString(req.body.description);
    let application_deadline = validation.isValidApplicationDeadline(parseInt(req.body.application_deadline));
    let host_time = validation.isValidHostTime(parseInt(req.body.host_time));
    let streetAddress = validation.isValidString(req.body.streetAddress);
    let city = validation.isValidString(req.body.city);
    let state = validation.isValidString(req.body.state);
    let zipcode = validation.isValidString(req.body.zipcode);

    if(host_time < application_deadline) throw "Error: Event Date & Time should be after Registration Deadline";

    let eventDetail = await eventData.getEventByEventId(req.params.id);
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
  }catch(e){
    res.json({ success: false, error: e });
  }
});

export default router;
