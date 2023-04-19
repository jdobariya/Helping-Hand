import loginRoutes from "./login.js";
import eventsRoutes from "./events.js";
import aboutRoutes from "./about.js";

const constructorMethod = (app) => {
  app.use("/home", (req, res) => {
    res.render("homepage", {
      title: "Helping Hands",
    });
  });
  app.use("/login", loginRoutes);
  app.use("/events", eventsRoutes);
  app.use("/about", aboutRoutes);

  app.use("*", (req, res) => {
    res.send({ Error: "Resource not found" });
  });
};

export default constructorMethod;
