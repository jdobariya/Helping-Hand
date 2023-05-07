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

  for (let i = 0; i < events.length; i++) {
    events[i].application_deadline = longEnUSFormatter
      .format(new Date(events[i].application_deadline))
      .toString();
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

router.route("/").patch(async (req, res) => {
  if (req.body.reqType === "like") {
    try {
      let updatedEventLikeCount = await eventData.addAndRemoveLikes(
        req.body.event_id,
        req.session.user_id
      );
      if (updatedEventLikeCount)
        res
          .status(200)
          .json({ success: true, likeCount: updatedEventLikeCount });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }
});

export default router;
