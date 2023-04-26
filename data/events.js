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

  // will return all app's events which have all the tags
  async getAllAppEventsByTags(tags) {
    tags = validation.isValidArray(tags);
    const eventCollection = await events();
    const eventsWithTags = eventCollection.find({ "tags": { $in: tags } });

    return eventsWithTags;
  },

  async addVolunteers(event_id, volunteer_id) {
    validation.checkId(event_id);
    event_id = event_id.trim(event_id);
    validation.checkId(volunteer_id);
    volunteer_id = volunteer_id.trim();

    const eventCollection = await events();
    const userCollection = await users();
    
    const event = await eventCollection.findOne({ _id: new ObjectId(event_id) });
    if (!event) throw `Error: event with id ${event_id} not found`;

    if(event.volunteers.includes(volunteer_id)) {
      throw `Error: volunteer with ${volunteer_id} id is already in events.volunteers array`;
    }

    event.volunteers.push(volunteer_id);
    let newEvent = await eventCollection.findOneAndUpdate(
      {_id: ObjectId(_id)},
      {$set: updatedEventData},
      {returnDocument: 'after'}
    );
    if (newEvent.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${_id}`];
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

};

export default exportedMethods;
