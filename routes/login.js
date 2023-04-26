import { Router } from "express";
import { isValidEmail, isValidString, validatePassword } from "../validation.js";

const router = Router();

router.route("/").get((req, res) => {
  res.render("login", {
    title: "Login",
  });
});

router.route("/").post((req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try{
    email = isValidString(email);
    email = email.toLowerCase();
    isValidEmail(email);
    password = isValidString(password);
    validatePassword(password);
  }catch(e){
    res.status(400).render('login', {title: 'Login', error: e});
  }

  try{
    // check the credentials against the database
    // if they are valid, redirect to the home page
    if(email !== credentials.email) throw "Email is incorrect";
    if(password !== credentials.password) throw "Password is incorrect";

    console.log(email, password);
    res.redirect("/home");
  }catch(e){
    res.status(400).render('login', {title: 'Login', error: e});
  }
});

export default router;
