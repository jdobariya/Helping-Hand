import { Router } from "express";
import {} from "../validation.js";

const router = Router();

router.route("/").get((req, res) => {
  res.render("about", {
    title: "About Us",
  });
});

export default router;
