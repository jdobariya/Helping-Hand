import { Router } from "express";
import {} from "../validation.js";

const router = Router();

router.route("/event/:id").get((req, res) => {
  res.render("event", {
    title: "Event Details",
  });
});

export default router;
