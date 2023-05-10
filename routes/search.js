import { Router } from "express";
import {} from "../validation.js";
import { eventData } from "../data/index.js";
import { changeDateFormat } from "./events.js";
import xss from "xss";
const router = Router();
router.route("/").get((req, res) => {
  return res.redirect("/events");
});
router.route("/").post(async (req, res) => {
  try {
    let searchValue = req.body.searchValue.trim();
    searchValue = xss(searchValue);
    if (!req.body.searchValue.trim()) {
      return res.redirect("/events");
    }
    let event = await eventData.getEventByKeyword(
      searchValue.trim().toLowerCase()
    );
    let eventsRow = changeDateFormat(event);

    if (req.session && req.session.loggedIn) {
      return res.render("events", {
        title: "Browse Events",
        user: true,
        allEvents: eventsRow,
        first_name: req.session.first_name,
        text: `Results for ${searchValue} are`,
        isHost: req.session.isHost,
      });
    } else {
      return res.render("events", {
        title: "Browse Events",
        user: false,
        allEvents: eventsRow,
        text: `results for ${searchValue} are`,
      });
    }
  } catch (e) {
    //console.log(e);
    return res.redirect("/events");
  }
});

export default router;
