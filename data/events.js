import {events} from '../config/mongoCollections.js';
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

  async removeEventById(id) {
    id = validation.isValidId(id);
    id = id.trim();

    const eventsCollection = await events();
    const deletionInfo = await eventsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0){
      throw [404, `Error: Could not delete event with id of ${id}`];
    }
    
    return {removeId: id, isRemoved: true};
  },

  async updateEventPatch(id, updatedEvent) {
    validation.isValidId(id);
    id = id.trim();

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
      {_id: ObjectId(id)},
      {$set: updatedEventData},
      {returnDocument: 'after'}
    );
    if (newEvent.lastErrorObject.n === 0)
      throw [404, `Could not update the event with id ${id}`];

    return newEvent.value;
  },

  // will return all app's events
  async getAllAppEvents() {
    const eventCollection = await events();
    return await eventCollection.find({}).toArray();
  },
  
  async getEventByEventId(id) {
    validation.checkId(id);
    id = id.trim();
    const eventCollection = await events();
    const event = await eventCollection.findOne({_id: ObjectId(id)});

    if (!event) throw 'Error: event not found';

    return event;
  },

  async getAllEventsByHostId(id) {
    validation.checkId(id);
    id = id.trim();

    const eventCollection = await events();
    const events = eventCollection.find({ "host_info.host_id": id }).toArray();
    
    return events;
  },

  async getAllEventsByVolunteerId(id) {
    validation.checkId(id);
    id = id.trim();

    const eventCollection = await events();
    const events = eventCollection.find({ "volunteers": id }).toArray();
    
    return events;
  },

  filterExpired(events, needExpired) {
    if(needExpired) {
      return events.filter(event => new Date(event.application_deadline) < new Date());
    }else {
      return events.filter(event => new Date(event.application_deadline) >= new Date());
    }
  },

  sortByTime(events, isNearestToFurthest) {
    if(isNearestToFurthest) {
      events.sort((a, b) => new Date(b.host_time) - new Date(a.host_time));
      return events;
    }else {
      events.sort((a, b) => new Date(a.host_time) - new Date(b.host_time));
      return events;
    }
  },

  // will return all app's events which have all the tags
  async getAllAppEventsWithTags(tags) {

  },

  // will return all app's events which is past
  async getAllAppEventsPast(currentDate, currentTime) {

  },

  // will return all app's events which is current
  async getAllAppEventsCurrent(currentDate, currentTime) {

  },
  
  // will return all app's events which is past and have all the tags
  async getAllAppEventsPastWithTags(currentDate, currentTime) {

  },
  
  // will return all app's events which is current and have all the tags
  async getAllAppEventsCurrentWithTags(currentDate, currentTime) {

  },

  // will return all events which is sorted first by date then by time
  async getAllAppEventsAndSortByStartDate() {

  },

  async getEventsByTag(tags) {

  },
};

export default exportedMethods;
