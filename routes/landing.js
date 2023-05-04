import { Router } from "express";
import {eventData} from "../data/index.js"
const router = Router();

router.route("/").get(async (req, res) => {
  if(req.session)
    {
  let id=req.session.user_id;
    if(id)
    {
  id=id.toString();
  try
  {
  let allEvents=await eventData.getAllEventsByVolunteerId(id);
  let expired_events=eventData.expiredEvents(allEvents,true);
  let future_events=eventData.expiredEvents(allEvents,false);
  return res.render('landing',{title:"Your Events",user:true,first_name:req.session.first_name,expired:expired_events,future:future_events})
  }
  catch(e)
  {
   return res.render('landing',{title:"Your Events",user:true,first_name:req.session.first_name,error:e});
  }
  
    }
    else return res.redirect('/login')
  }

    else
    {
      return res.redirect('/login');
    //return res.render('landing',{title:"History",user:true,first_name:req.session.first_name})
    }
  
  });

export default router;