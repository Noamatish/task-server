const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const emailsRouter = require("./emails");

router.use("/users", usersRouter);
router.use("/emails", emailsRouter);


module.exports = router;
