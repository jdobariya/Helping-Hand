import loginRoutes from "./login.js";
import eventsRoutes from "./events.js";
import aboutRoutes from "./about.js";
import signUpRoutes from "./signup.js";
import logoutRoute from "./logout.js";
import { eventData } from "../data/index.js";
const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    return res.redirect("/home");
  });

  app.use("/home", async (req, res) => {
    let events = await eventData.getAllAppEvents();

    if (req.session && req.session.loggedIn) {
      return res.render("homepage", {
        title: "Helping Hands",
        user: true,
        allEvents: events,
      });
    } else {
      return res.render("homepage", {
        title: "Helping Hands",
        user: false,
        allEvents: events,
      });
    }
  });
  app.use("/logout", logoutRoute);
  app.use("/login", loginRoutes);
  app.use("/events", eventsRoutes);
  app.use("/about", aboutRoutes);
  app.use("/signup", signUpRoutes);

  app.use("*", (req, res) => {
    res.send({ Error: "Resource not found" });
  });
};

export default constructorMethod;
