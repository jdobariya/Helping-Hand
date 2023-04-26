import {events, users} from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js'; 

const exportedMethods = {
  async addEvent (
    event_name,
    description,
    tags,
    application_deadline,
    host_time,
    location,
    host_info,
  ){
    let {
      event_name,
      description,
      tags,
      application_deadline,
      host_time,
      location,
      host_info,
      stories,
      feedbacks,
      likes
    } = validation.checkEventsInputs(
      event_name,
      description,
      tags,
      application_deadline,
      host_time,
      location,
      host_info,);

    const now = new Date();
    
    const release_time = now.getTime();

    const newEvent = {
      event_name,
      description,
      tags,
      release_time,
      application_deadline,
      host_time,
      location,
      volunteers,
      host_info,
      stories,
      feedbacks,
      likes
    };

    const eventsCollection = await events();
    const insertEvent = await eventsCollection.insertOne(newEvent);
    if (!insertEvent.insertedId) throw "Failed Inserting a event";
    let newId=insertUser.insertedId.toString();
    return await this.getEventById(newId);
  },

  async removeEventById(_id) {
    _id = validation.isValidId(_id);
    _id = _id.trim();

    const eventsCollection = await events();
    const deletionInfo = await eventsCollection.findOneAndDelete({
      _id: new ObjectId(_id),
    });
    if (deletionInfo.lastErrorObject.n === 0){
      throw [404, `Error: Could not delete event with id of ${_id}`];
    }
    
    return {removeId: _id, isRemoved: true};
  },

  async updateEventPatch(_id, eventInfo) {
    validation.isValidId(_id);
    _id = vid.trim();

    const updatedEventData = {};
    if(eventInfo.event_name) {
      updatedEventData.event_name = validation.isValidString(eventInfo.event_name);
    }
    
    if(eventInfo.description) {
      updatedEventData.description = validation.isValidString(eventInfo.description);
    }

    if(eventInfo.tags) {
      updatedEventData.tags = validation.isValidArray(eventInfo.tags);
    }

    if(eventInfo.application_deadline) {
      updatedEventData.application_deadline = validation.isValidTime(eventInfo.application_deadline);
    }
    
    if(eventInfo.host_time) {
      updatedEventData.host_time = validation.isValidTime(eventInfo.host_time);
    }

    if(eventInfo.location) {
      updatedEventData.location = validation.isValidLocation(eventInfo.location);
    }

    if(eventInfo.host_info) {
      updatedEventData.host_info = validation.isValidHostInfo(eventInfo.host_info);
    }

    const eventCollection = await events();
    let newEvent = await eventCollection.findOneAndUpdate(
      {_id: ObjectId(_id)},
      {$set: updatedEventData},
      {returnDocument: 'after'}
    );
    if (newEvent.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return newEvent.value;
  },

  // will return all app's events
  async getAllAppEvents() {
    const eventCollection = await events();
    return await eventCollection.find({}).toArray();
  },
  
  async getEventByEventId(_id) {
    validation.checkId(_id);
    _id = _id.trim();
    const eventCollection = await events();
    const event = await eventCollection.findOne({_id: ObjectId(_id)});

    if (!event) throw `Error: event with id ${_id} not found`;

    return event;
  },

  async getAllEventsByHostId(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const events = eventCollection.find({ "host_info.host_id": _id }).toArray();
    
    return events;
  },

  async getAllEventsByVolunteerId(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const events = eventCollection.find({ "volunteers": _id }).toArray();
    
    return events;
  },

  filterExpired(events, needExpired) {
    if(needExpired) {
      return events.filter(event => new Date(event.application_deadline) < new Date());
    }else {
      return events.filter(event => new Date(event.application_deadline) >= new Date());
    }
  },

  sortByTime(events, needNearestToFurthest) {
    if(needNearestToFurthest) {
      events.sort((a, b) => new Date(b.host_time) - new Date(a.host_time));
      return events;
    }else {
      events.sort((a, b) => new Date(a.host_time) - new Date(b.host_time));
      return events;
    }
  },

  async getAllFeedbacksByEventId(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ _id: new ObjectId(_id) });
    if(!event) {
      throw `Error: event with ${_id} not found`;
    }

    return event.feedbacks;
  },

  async getFeedbackByFeedbackId(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ "feedbacks._id": new ObjectId(_id) });
    if(!event) {
      throw `Error: feedback with ${_id} not found`;
    }

    for(let feedback of event.feedbacks) {
      if(feedback._id.toString() === _id) {
        feedback._id = feedback._id.toString();
        return feedback;
      }
    }
  },

  async getAllStoriesByEventId() {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ _id: new ObjectId(_id) });
    if(!event) {
      throw `Error: event with ${_id} not found`;
    }

    return event.stories;
  },

  async getAllStoriesByVolunteerId(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const events = eventCollection.find({ "stories.volunteer_id": _id }).toArray();
    if(!events) {
      throw `Error: volunteer with ${_id} has no story`;
    }

    const stories = []; 
    for(let event of events) {
      for(let story of event.stories) {
        if(story.volunteer_id === _id) {
          story._id = story._id.toString();
          stories.push(story);
        }
      }
    }

    return stories;
  },

  async removeStory(_id) {
    validation.checkId(_id);
    _id = _id.trim();

    const eventCollection = await events();
    const event = eventCollection.findOne({ "stories._id": new Object(_id) });
    if(!event) {
      throw `Error: story with ${_id} not found`;
    }

    event.stories.filter(story => story._id.toString() === _id);

    const unpdateInfo = eventCollection.findOneAndUpdate(
      {_id: event._id},
      {$set: {stories: event.stories}},
      {returnDocument: "after"}
    );

    if (unpdateInfo.lastErrorObject.n === 0)
      throw [404, `Could not remove the story with id ${_id}`];

    return unpdateInfo.value;
  },

  async addVolunteers(event_id, volunteer_id) {
    validation.checkId(event_id);
    event_id = event_id.trim(event_id);
    validation.checkId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();
    
    const event = await eventCollection.findOne({ _id: new ObjectId(event_id) });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if(event.volunteers.includes(volunteer_id)) {
      throw `Error: volunteer with ${volunteer_id} id is already in event.volunteers array`;
    }

    event.volunteers.push(volunteer_id);
    let updateInfo = await eventCollection.findOneAndUpdate(
      {_id: ObjectId(event_id)},
      {$set: {volunteers: event.volunteers}},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return updateInfo.value;
  },

  async addLikes(event_id, volunteer_id) {
    validation.checkId(event_id);
    event_id = event_id.trim(event_id);
    validation.checkId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();

    const event = await eventCollection.findOne({ _id: new ObjectId(event_id) });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if(event.likes.includes(volunteer_id)) {
      throw `Error: volunteer with ${volunteer_id} id is already in event.likes array`;
    }

    event.likes.push(volunteer_id);
    let updateInfo = await eventCollection.findOneAndUpdate(
      {_id: ObjectId(event_id)},
      {$set: {likes: event.likes}},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];

    return updateInfo.value;
  }
};

export default exportedMethods;
