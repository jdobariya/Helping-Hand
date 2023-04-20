import {Router} from "express";
import {} from "../validation.js";

const router = Router();

router.route("/").get((req, res) => {
    res.render('signup', {
        title: 'Sign Up'
    })
})

router.route("/").post((req, res) => {
    let body = req.body;
    let firstName = body.first_name;
    let lastName = body.last_name;
    let password = body.password;

    console.log(firstName, lastName, password)
    res.redirect('/home')
})

export default router