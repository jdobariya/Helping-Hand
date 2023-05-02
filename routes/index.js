import loginRoutes from "./login.js";
import eventsRoutes from "./events.js";
import aboutRoutes from "./about.js";
import signUpRoutes from "./signup.js";
import logoutRoute from './logout.js';
import profileRoute from './profile.js';
import {eventData} from '../data/index.js'
const constructorMethod = (app) => {
  app.get('/',(req,res)=>{
    return res.redirect('/home')
  });

  app.get("/home", async (req, res) => {
    let events=await eventData.getAllAppEvents();
    res.render('homepage',{allEvents:events})
  });

  app.use("/logout",logoutRoute);
  app.use("/login", loginRoutes);
  app.use("/events", eventsRoutes);
  app.use("/about", aboutRoutes);
  app.use("/signup", signUpRoutes);
  app.use("/profile", profileRoute);


  app.use("*", (req, res) => {
    res.redirect("/home");
  });
};

export default constructorMethod;
