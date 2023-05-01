import { Router } from "express";
import {} from "../validation.js";
import { eventData } from "../data/index.js";

const router = Router();

function getEventsInRow(events) {
  let eventRows = [];
  let eventsCol = {};
  let eventsInRow = [];
  for (let i = 0; i < events.length; i++) {
    if ((i + 1) % 3 === 0) {
      eventsInRow.push(events[i]);
      eventsCol["row"] = eventsInRow;
      eventRows.push(eventsCol);
      eventsCol = {};
      eventsInRow = [];
    } else {
      eventsInRow.push(events[i]);
    }
  }
  if (eventsInRow.length > 0) {
    eventsCol["row"] = eventsInRow;
    eventRows.push(eventsCol);
  }
  return eventRows;
}
router.route("/").get(async (req, res) => {
  let events = await eventData.getAllAppEvents();
  let eventRows = getEventsInRow(events);
  if (req.session && req.session.loggedIn) {
    return res.render("events", {
      title: "Browse Events",
      user: true,
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
