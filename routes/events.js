import { Router } from "express";
import {} from "../validation.js";
import { eventData } from "../data/index.js";

const router = Router();

export function changeDateFormat(events) {
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let deadlineDateAndTime;

  for (let i = 0; i < events.length; i++) {
    deadlineDateAndTime = events[i].application_deadline.split(" ");
    events[i].application_deadline =
      longEnUSFormatter
        .format(new Date(events[i].application_deadline))
        .toString() +
      " " +
      deadlineDateAndTime[1] +
      " " +
      deadlineDateAndTime[2];
  }

  return events;
}
router.route("/").get(async (req, res) => {
  let events = await eventData.getAllAppEvents();
  let eventRows = changeDateFormat(events);
  if (req.session && req.session.loggedIn) {
    return res.render("events", {
      title: "Browse Events",
      user: true,
      first_name: req.session.first_name,
      allEvents: eventRows,
    });
  } else {
    return res.render("events", {
      title: "Browse Events",
      user: false,
      allEvents: eventRows,
    });
  }
});

export default router;
