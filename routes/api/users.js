const express = require("express");
const router = new express.Router();
const Controller = require("../../controllers/user");
const auth = require("../../middlewares/auth.js");

//Login user
router.post("/login", Controller.login);
// //Register user
router.post("/register", Controller.register);
//Middleware for authenticated routes
router.use(auth.tokenMiddleware());
//verify user token - keep him online
router.get("/me", Controller.me);



module.exports = router;
