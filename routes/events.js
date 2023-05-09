import { Router } from "express";
import {} from "../validation.js";
import { eventData } from "../data/index.js";

const router = Router();

export function changeDateFormat(events) {
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  for (let i = 0; i < events.length; i++) {
    events[i].application_deadline = longEnUSFormatter
      .format(new Date(events[i].application_deadline))
      .toString();

    events[i].release_time = longEnUSFormatter
      .format(new Date(events[i].release_time))
      .toString();

    events[i].host_time = longEnUSFormatter
      .format(new Date(events[i].host_time))
      .toString();
  }

  return events;
}

router.route("/").get(async (req, res) => {
  try{  
    let totalEventsCount = await eventData.getEventsCount();
    let limit = 15;
    let skip = 0;
    let currEventCount = 15;
    let events = await eventData.getAllAppEvents(limit, skip);

    let eventRows = changeDateFormat(events);
    if (req.session && req.session.loggedIn) {
      return res.render("events", {
        title: "Browse Events",
        user: true,
        first_name: req.session.first_name,
        allEvents: eventRows,
        totalEventsCount,
        currEventCount,
        isHost: req.session.isHost,
      });
    } else {
      return res.render("events", {
        title: "Browse Events",
        user: false,
        allEvents: eventRows,
        totalEventsCount,
        currEventCount,
      });
    }
  }catch(e){
      if(req.session && req.session.loggedIn)
        res.status(500).render("error", { 
          title: "Error", 
          error: 500,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost
        });
      else 
        res.status(500).render("error", {
          title: "Error",
          error: 500,
          user: false
        });
  }
});

router.route("/loadevents").get(async (req, res) => {
  try{  
    if(req.xhr){      
      let limit = 15;
      let skip = parseInt(req.query.currEventCount);
      let totalEventsCount = await eventData.getEventsCount();
      let events = await eventData.getAllAppEvents(limit, skip);
      events = changeDateFormat(events);
      let eventStr = "";
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        eventStr += `<div
        class="card"
        data-popularity="${event.likes.length}"
        data-recent="${event.release_time}"
        data-due="${event.application_deadline}">`;

        if (event.image_url.length) {
          eventStr += `<img
          src="/${event.image_url[0]}"
          class="image"
        
      />`;
        } else {
          eventStr += `<img
          src="/public/images/No_Image_Available.jpg"
          class="image"
          alt="No Image Available for this event"
      />`;
        }

        eventStr += `<div class="card-body">
        <a class="eventA" href="event/${event._id}">
        <p class="card-title">${event.event_name}</p></a>
        <p class="card-text">${event.description}</p>
        <p><span class="likeCount">${event.likes.length}</span>&nbsp;<i
        class="fa fa-heart"
        onclick="likeEvent(this,'${event._id}')"
      ></i>
    </p>
        <p>Registration Deadline:&nbsp;<span class="e-date">${event.application_deadline}</span></p>
        </div>
    </div>`;
      }

      res.status(200).json({
        success: true,
        eventStr,
        returneventsLength: events.length,
        totalEventsCount,
      });
    }else {
      if(req.session && req.session.loggedIn)
        res.status(404).render("error", { 
          title: "Error", 
          error: 404,
          user: true,
          first_name: req.session.first_name,
          isHost: req.session.isHost
        });
      else 
        res.status(404).render("error", {
          title: "Error",
          error: 404,
          user: false
        });
    }
  }catch(e){
    if(req.session && req.session.loggedIn)
      res.status(500).render("error", { 
        title: "Error", 
        error: 500,
        user: true,
        first_name: req.session.first_name,
        isHost: req.session.isHost
      });
    else 
      res.status(500).render("error", {
        title: "Error",
        error: 500,
        user: false
      });
  }
});

router.route("/like").patch(async (req, res) => {
  if (req.xhr && req.body.reqType === "like") {
    try {
      let updatedEventLikeCount = await eventData.addAndRemoveLikes(
        req.body.event_id,
        req.session.user_id
      );

      if (updatedEventLikeCount > -1)
        res
          .status(200)
          .json({ success: true, likeCount: updatedEventLikeCount });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }else{
    res.status(404).json({ success: false, error: "404: Not Found" });
  }
});

export default router;
