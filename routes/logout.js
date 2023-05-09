import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {

    req.session.destroy()
   return res.render('logout',{title:'logout'})
});

export default router;
