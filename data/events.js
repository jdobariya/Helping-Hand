import { events } from "../config/mongoCollections.js";
import userInfo from "./users.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import e from "express";

const exportedMethods = {
  async addEvent(
    event_name,
    description,
    application_deadline,
    host_time,
    location,
    host_info,
    image_url
  ) {
    let tempEvent = validation.checkEventsInputs(
      event_name,
      description,
      application_deadline,
      host_time,
      location,
      host_info,
      image_url
    );

    const now = new Date();

    const rele_time = now.getTime();

    const newEvent = {
      event_name: tempEvent.event_name,
      description: tempEvent.description,
      release_time: rele_time,
      application_deadline: tempEvent.application_deadline,
      host_time: tempEvent.host_time,
      location: tempEvent.location,
      image_url: tempEvent.image_url,
      volunteers: tempEvent.volunteers,
      host_info: tempEvent.host_info,
      stories: tempEvent.stories,
      feedbacks: tempEvent.feedbacks,
      likes: tempEvent.likes,
      image_url: tempEvent.image_url,
    };

    const eventsCollection = await events();
    const insertEvent = await eventsCollection.insertOne(newEvent);
    if (!insertEvent.insertedId) throw "Failed Inserting a event";
    let newId = insertEvent.insertedId.toString();
    return await this.getEventByEventId(newId);
  },

  async removeEventById(_id) {
    _id = validation.isValidId(_id);
    _id = _id.trim();

    const eventsCollection = await events();
    const deletionInfo = await eventsCollection.findOneAndDelete({
      _id: new ObjectId(_id),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw [404, `Error: Could not delete event with id of ${_id}`];
    }

    return { removeId: _id, isRemoved: true };
  },

  async updateEventPatch(_id, eventInfo) {
    validation.isValidId(_id);
    _id = vid.trim();

    const updatedEventData = {};
    if (eventInfo.event_name) {
      updatedEventData.event_name = validation.isValidString(
        eventInfo.event_name
      );
    }

    if (eventInfo.description) {
      updatedEventData.description = validation.isValidString(
        eventInfo.description
      );
    }

    if (eventInfo.tags) {
      updatedEventData.tags = validation.isValidArray(eventInfo.tags);
    }

    if (eventInfo.application_deadline) {
      updatedEventData.application_deadline = validation.isValidTimeStamp(
        eventInfo.application_deadline
      );
    }

    if (eventInfo.host_time) {
      updatedEventData.host_time = validation.isValidTimeStamp(
        eventInfo.host_time
      );
    }

    if (eventInfo.location) {
      updatedEventData.location = validation.isValidLocation(
        eventInfo.location
      );
    }

    if (eventInfo.host_info) {
      updatedEventData.host_info = validation.isValidHostInfo(
        eventInfo.host_info
      );
    }

    if (eventInfo.image_url) {
      updatedEventData.image_url = validation.isValidImageUrl(image_url);
    }

    const eventCollection = await events();
    let newEvent = await eventCollection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updatedEventData },
      { returnDocument: "after" }
    );
    if (newEvent.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return newEvent.value;
  },

  // will return all app's events
  async getAllAppEvents() {
    const eventCollection = await events();

    let all = await eventCollection.find({}).toArray();
    all = all.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return all;
  },

  async getEventByEventId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();
    const eventCollection = await events();
    const event = await eventCollection.findOne({ _id: new ObjectId(_id) });

    if (!event) throw `Error: event with id ${_id} not found`;

    return event;
  },

  async getAllEventsByHostId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();

    const eventsArray = await eventCollection
      .find({ "host_info.host_id": _id })
      .toArray();

    return eventsArray;
  },

  async getAllEventsByVolunteerId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();

    const eventsArray = await eventCollection
      .find({ volunteers: { $in: [_id] } })
      .toArray();

    return eventsArray;
  },

  filterExpiredEventsOrNonExpiredEventsByApplicationDeadline(
    events,
    needExpired
  ) {
    if (needExpired) {
      return events.filter(
        (event) => new Date(event.application_deadline) < new Date()
      );
    } else {
      return events.filter(
        (event) => new Date(event.application_deadline) >= new Date()
      );
    }
  },

  filterExpiredEventsOrNonExpiredEventsByHostTime(events, needExpired) {
    if (needExpired) {
      return events.filter((event) => new Date(event.host_time) < new Date());
    } else {
      return events.filter((event) => new Date(event.host_time) >= new Date());
    }
  },

  sortByHostTime(events, needNearestToFurthest) {
    if (needNearestToFurthest) {
      events.sort((a, b) => new Date(b.host_time) - new Date(a.host_time));
      return events;
    } else {
      events.sort((a, b) => new Date(a.host_time) - new Date(b.host_time));
      return events;
    }
  },

  sortByReleaseTime(events, needNearestToFurthest) {
    if (needNearestToFurthest) {
      events.sort(
        (a, b) => new Date(b.release_time) - new Date(a.release_time)
      );
      return events;
    } else {
      events.sort(
        (a, b) => new Date(a.release_time) - new Date(b.release_time)
      );
      return events;
    }
  },

  sortByLikes(events, needPopularToNonPopular) {
    if (needPopularToNonPopular) {
      events.sort((a, b) => b.likes.length - a.likes.length);
      return events;
    } else {
      events.sort((a, b) => a.likes.length - b.likes.length);
      return events;
    }
  },

  async getAllFeedbacksByEventId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ _id: new ObjectId(_id) });
    if (!event) {
      throw `Error: event with ${_id} not found`;
    }

    return event.feedbacks;
  },

  async getFeedbackByFeedbackId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({
      "feedbacks._id": new ObjectId(_id),
    });
    if (!event) {
      throw `Error: feedback with ${_id} not found`;
    }

    for (let feedback of event.feedbacks) {
      if (feedback._id.toString() === _id) {
        feedback._id = feedback._id.toString();
        return feedback;
      }
    }
  },

  async getAllStoriesByEventId() {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ _id: new ObjectId(_id) });
    if (!event) {
      throw `Error: event with ${_id} not found`;
    }

    return event.stories;
  },

  async getAllStoriesByVolunteerId(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const events = eventCollection
      .find({ "stories.volunteer_id": _id })
      .toArray();
    if (!events) {
      throw `Error: volunteer with ${_id} has no story`;
    }

    const stories = [];
    for (let event of events) {
      for (let story of event.stories) {
        if (story.volunteer_id === _id) {
          story._id = story._id.toString();
          stories.push(story);
        }
      }
    }

    return stories;
  },

  async removeStory(_id) {
    validation.isValidId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ "stories._id": new Object(_id) });
    if (!event) {
      throw `Error: story with ${_id} not found`;
    }

    event.stories.filter((story) => story._id.toString() === _id);

    const unpdateInfo = eventCollection.findOneAndUpdate(
      { _id: event._id },
      { $set: { stories: event.stories } },
      { returnDocument: "after" }
    );

    if (unpdateInfo.lastErrorObject.n === 0)
      throw [404, `Could not remove the story with id ${_id}`];

    return unpdateInfo.value;
  },

  async addVolunteerToEvent(event_id, volunteer_id) {
    validation.isValidId(event_id);
    event_id = event_id.trim(event_id);
    validation.isValidId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();

    const event = await eventCollection.findOne({
      _id: new ObjectId(event_id),
    });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if (event.volunteers.includes(volunteer_id)) {
      throw `Error: volunteer with ${volunteer_id} id is already in event.volunteers array`;
    }

    event.volunteers.push(volunteer_id);
    let updateInfo = await eventCollection.findOneAndUpdate(
      { _id: new ObjectId(event_id) },
      { $set: { volunteers: event.volunteers } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return updateInfo.value;
  },

  async removeVolunteerToEvent(event_id, volunteer_id) {
    validation.isValidId(event_id);
    event_id = event_id.trim(event_id);
    validation.isValidId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();

    const event = await eventCollection.findOne({
      _id: new ObjectId(event_id),
    });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if (event.volunteers.includes(volunteer_id)) {
      event.volunteers.splice(event.volunteers.indexOf(volunteer_id), 1);
    }

    console.log(event.volunteers);

    let updateInfo = await eventCollection.findOneAndUpdate(
      { _id: new ObjectId(event_id) },
      { $set: { volunteers: event.volunteers } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return updateInfo.value;
  },

  async addLikes(event_id, volunteer_id) {
    validation.isValidId(event_id);
    event_id = event_id.trim(event_id);
    validation.isValidId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();

    const event = await eventCollection.findOne({
      _id: new ObjectId(event_id),
    });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if (event.likes.includes(volunteer_id)) {
      throw `Error: volunteer with ${volunteer_id} id is already in event.likes array`;
    }

    event.likes.push(volunteer_id);
    let updateInfo = await eventCollection.findOneAndUpdate(
      { _id: new ObjectId(event_id) },
      { $set: { likes: event.likes } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return updateInfo.value;
  },

  async addLoggedInUserFeedback(eventId, userId, feedback_comment) {
    eventId = eventId.toString().trim();
    validation.isValidId(eventId);

    userId = userId.toString().trim();
    validation.isValidId(userId);

    const eventsCollection = await events();

    let userData = await userInfo.getUserById(userId);
    feedback_comment = validation.isValidString(feedback_comment);

    let newFeedback = {
      _id: new ObjectId(),
      volunteer_id: userId,
      email: userData.email,
      firstname: userData.first_name,
      lastname: userData.last_name,
      feedback_comment: feedback_comment,
    };

    let insertFeedback = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $push: { feedback: newFeedback } }
    );

    if (insertFeedback.lastErrorObject.n === 0) {
      throw "Error: could not update feedback";
    }

    return { updatedFeedback: true };
  },

  async addNonLoggedInUserFeedback(eventId, feedbackWithEmailAndName) {
    eventId = eventId.toString().trim();
    validation.isValidId(eventId);

    feedbackWithEmailAndName.feedback_comment = validation.isValidString(
      feedbackWithEmailAndName.feedback_comment
    );
    feedbackWithEmailAndName.email = validation.isValidEmail(
      feedbackWithEmailAndName.email
    );
    feedbackWithEmailAndName.lastName = validation.isValidString(
      feedbackWithEmailAndName.lastName
    );
    feedbackWithEmailAndName.lastName = validation.isValidName(
      feedbackWithEmailAndName.lastName
    );
    feedbackWithEmailAndName.firstName = validation.isValidString(
      feedbackWithEmailAndName.firstName
    );
    feedbackWithEmailAndName.firstName = validation.isValidName(
      feedbackWithEmailAndName.firstName
    );

    const eventsCollection = await events();

    let newFeedback = {
      _id: new ObjectId(),
      volunteer_id: "",
      email: feedbackWithEmailAndName.email,
      firstname: feedbackWithEmailAndName.first_name,
      lastname: feedbackWithEmailAndName.last_name,
      feedback_comment: feedbackWithEmailAndName.feedback_comment,
    };

    let insertFeedback = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $push: { feedback: newFeedback } }
    );

    if (insertFeedback.lastErrorObject.n === 0) {
      throw "Error: could not update feedback";
    }

    return { updatedFeedback: true };
  },

  async addStory(eventId, userId, story) {
    eventId = eventId.toString().trim();
    validation.isValidId(eventId);
    userId = userId.toString().trim();
    validation.isValidId(userId);

    const eventsCollection = await events();
    let userData = await userInfo.getUserById(userId.toString());

    let newStory = {
      _id: new ObjectId(),
      volunteer_fname: userData.first_name,
      volunteer_lname: userData.last_name,
      story_comment: story,
    };

    let insertStory = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $push: { story: newStory } }
    );
    if (insertStory.lastErrorObject.n === 0) {
      throw "Error: could not update story";
    }

    return { updatedStory: true };
  },

  async getEventByKeyword(keyword) {
    const regex = new RegExp(keyword, "i");
    keyword = keyword.trim();
    let array = await this.getAllAppEvents();
    const filteredArray = array.filter((obj) => {
      return validation.searchObject(obj, regex);
    });
    console.log(filteredArray);
    return filteredArray;
  },
};

export default exportedMethods;
