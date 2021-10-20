const express = require("express");
const router = new express.Router();
const Controller = require("../../controllers/email");
const auth = require("../../middlewares/auth.js");

//Update email click
router.put("/", Controller.emailClicked);

router.use(auth.tokenMiddleware());

//Get all emails
router.get("/", Controller.getEmails);

//Generate an email
router.post("/", Controller.generateEmail);

module.exports = router;
