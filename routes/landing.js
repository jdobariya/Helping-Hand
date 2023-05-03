import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
    
    return res.render('landing',{title:"History",user:true,first_name:req.session.first_name})
    
  });

export default router;