import {users, events} from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js'; 
import userInfo from './users.js'
const exportedMethods = {
  async addEvent (
    event_name,
    description,
    releaseDate,
    releaseTime,
    registerExpireDate,
    registerEXpireTime,
    hostDate,
    hostTime,
    location,
    hostInfo,
    tags,
  ){

<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  },

  async removeEvent(id) {
    // validation.isValidId(id.toString())
    // const eventsCollection=await events();
    // id=id.trim()
    // const deletionInfo = await eventsCollection.findOneAndDelete({
    //   _id: new ObjectId(id),
    // });
    // if (deletionInfo.lastErrorObject.n === 0)
    //   throw [404, `Error: Could not delete an event with id of ${id}`];

    // return true;
  },

  async updateEventPatch(id, updatedEvent) {

  },

  // will return all app's events
  async getAllAppEvents() {

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
    // validation.isValidId(id);
    // id=id.trim()
    // const eventCollection = await Events();
    // const event = await userCollection.findOne({ _id: new ObjectId(id)});
    // if (event==null) throw "Error: No user found";
    
    // return event;
  },

  async getEventsByTag(tags) {

  },

  async addFeedback(eventId,userId="",feedback) {
    eventId=eventId.toString().trim()
    validation.isValidId(eventId)
    userId=userId.toString().trim()
    validation.isValidId(userId)
    const eventsCollection=await events();
    let userAvailable=true
    try
    {
    let userData=await userInfo.getUserById(userId.toString())
    feedback=feedback.toLowerCase()
    feedback=feedback.charAt(0).toUpperCase()+feedback.slice(1)
    let newFeedback={
      _id:new ObjectId(),
      firstname:userData.first_name,
      lastname:userData.last_name,
      feedback_comment:feedback
    }
    let insertFeedback=await eventsCollection.findOneAndUpdate(
      {_id:new ObjectId(eventId)},
      {$push:{'feedback':newFeedback}})
      if (insertFeedback.lastErrorObject.n === 0) {
        throw "Error: could not update feedback";
      }
    }
    catch(e)
    {
      userAvailable=false;
    }
    
      if(userAvailable)
      {
      try 
      {
      await userInfo.addFeedback(newFeedback._id.toString(),userId)
      }
      catch(e)
      {
        throw e;
      }
    }
      return {updatedFeedback:true}
  },

  async addStory(eventId, userId,story) {
    eventId=eventId.toString().trim()
    validation.isValidId(eventId)
    userId=userId.toString().trim()
    validation.isValidId(userId)
    const eventsCollection=await events();
    let userData=await userInfo.getUserById(userId.toString())
    let newStory={
      _id:new ObjectId(),
      volunteer_fname:userData.first_name,
      volunteer_lname:userData.last_name,
      story_comment:story
    }
    let insertStory=await eventsCollection.findOneAndUpdate(
      {_id:new ObjectId(eventId)},
      {$push:{'story':newStory}})
      if (insertStory.lastErrorObject.n === 0) {
        throw "Error: could not update story";
      }
      try
      {
      await userInfo.addStory(newStory._id.toString(),userId)
      }
      catch(e)
      {
        throw e
      }
      return {updatedStory:true}

  }
};

export default exportedMethods;