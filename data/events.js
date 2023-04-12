import {events} from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js'; 

const exportedMethods = {
  async addEvent (
    event_name,
    description,
    date,
    time,
    location,
    hostInfo,
    tags,
  ){

  },

  async removeEvent(id) {

  },

  async updateEventPatch(id, updatedEvent) {

  },

  // will return all app's events
  async getAllAppEvents() {

  },

  // will return all app's events which have all the tags(Array)
  async getAllAppEventsWithTags(tags) {

  },
  
  async getAllAppEvents() {

  },

  async getAllUserHostEvents() {

  },

  async getAllUserParticipateEvents() {

  },

  async getEventById(id) {

  },

  async getEventsByTag() {

  }
};

export default exportedMethods;