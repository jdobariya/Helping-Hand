import {Router} from "express";
import { isValidEmail, isValidName, isValidString, validatePassword } from "../validation.js";


const router = Router();

router.route("/").get((req, res) => {
    res.render('signup', {
        title: 'Sign Up'
    })
})

router.route("/").post((req, res) => {
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let repeatPassword = req.body.repeat_password;

  try{
    firstName = isValidString(firstName);
    isValidName(firstName);

    lastName = isValidString(lastName);
    isValidName(lastName);

    email = isValidString(email);
    email = email.toLowerCase();
    isValidEmail(email);

    password = isValidString(password);
    validatePassword(password);

    repeatPassword = isValidString(repeatPassword);
    if(repeatPassword !== password) throw 'Passwords do not match'
  }catch(e){
    res.status(400).render('signup', {title: 'Sign Up', error: e});
  }

  try{
    // add the user to the database
    // if they are valid, redirect to the home page

    console.log(firstName, lastName, email, password, repeatPassword);
    res.redirect("/home");
  }catch(e){
    res.status(400).render('login', {title: 'Login', error: e});
  }
})

export default router