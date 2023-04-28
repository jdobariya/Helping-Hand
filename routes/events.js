import { Router } from "express";
import {} from "../validation.js";

const router = Router();

router.route("/").get((req, res) => {
  if(req.session &&req.session.loggedIn)
    {
      return res.render('events',{title:"Browse Events",user:true})
     }
    else
    {
    return  res.render('events',{title:"Browse Events",user:false})
    }
  });

export default router;
