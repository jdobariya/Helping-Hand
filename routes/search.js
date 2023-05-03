import { Router } from "express";
import {} from "../validation.js";
import {eventData} from '../data/index.js';
import { getEventsInRow } from "./events.js";
const router = Router();
router.route("/").get((req,res)=>
{
return res.redirect('/events')
})
router.route("/").post(async(req, res) => {
    try
    {
        if(!req.body.searchValue.trim())
        {
            return res.redirect('/events')
        }
  let event=await eventData.getEventByKeyword(req.body.searchValue.trim().toLowerCase())
  let eventsRow=getEventsInRow(event);

  if(req.session &&req.session.loggedIn)
    {
      return res.render('events',{title:"Browse Events",user:true,allEvents:eventsRow,text:`Results for ${req.body.searchValue} are`})
     }
    else
    {
    return  res.render('events',{title:"Browse Events",user:false,allEvents:eventsRow,text:`results for ${req.body.searchValue} are`})
    }
}
catch(e)
{
   
  console.log(e)
    return res.redirect('/events')

}
  });

export default router;
