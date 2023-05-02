import { Router } from "express";
import usersData from "../data/users.js";
import eventsData from "../data/events.js";
import * as validation from "../validation.js";

const router = Router();

router.route("/").get(async (req, res) => {
    const id = req.session.user_id;

    const user = await usersData.getUserById(id);

    const events = user.isHost? await eventsData.getAllEventsByHostId(id): 
    await eventsData.getAllEventsByVolunteerId(id);

    res.render("profile", {
        title: "Profile",
        user: user,
        events: events
    });
    }
);

router.route("/").post(async (req, res) => {
    const id = req.session.user_id;

    let first_name = validation.isValidString(req.body.first_name);
    validation.isValidName(first_name);
    let last_name = validation.isValidString(req.body.last_name);
    validation.isValidName(last_name);
    let email = validation.isValidString(req.body.email);
    validation.isValidEmail(email);
    let contact = validation.isValidString(req.body.contact);
    let bio = validation.isValidString(req.body.bio);
    let skills = validation.isValidArray(req.body.skills);
    let address = validation.isValidString(req.body.address);

    const userInfo = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        contact: contact,
        bio: bio,
        skills: skills,
        address: address,
    };

    const updatedUser = await usersData.updateUserProfile(
        id,
        userInfo
    );

    res.render("profile", {
        title: "Profile",
        user: updatedUser,
    });
});

export default router;