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
      host_info,
      stories,
      feedbacks,
      likes
    };

    const eventsCollection = await events();
    const insertEvent = await eventsCollection.insertOne(newEvent);
    if (!insertEvent.insertedId) throw "Failed Inserting a event";
    let newId=insertUser.insertedId.toString();
    console.log(newId)
    return await this.getEventById(newId);
  },

  async removeEvent(id) {

  },

  async updateEventPatch(id, updatedEvent) {

  },

  // will return all app's events
  async getAllAppEvents() {

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

  async getAllUserHostEvents() {

  },

  async getAllUserParticipateEvents() {

  },

  async getEventById(id) {

  },

  async getEventsByTag(tags) {

  },

  async addFeedback(eventId, feedback) {

  },

  async addStory(eventId, story) {

  }
};

export default exportedMethods;
