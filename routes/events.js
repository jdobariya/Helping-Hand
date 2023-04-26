import { Router } from "express";
import {} from "../validation.js";

const router = Router();

router.route("/").get((req, res) => {
  res.render("events", {
    title: "Browse Events",
  });
});

export default router;
