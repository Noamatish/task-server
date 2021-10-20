const express = require("express");
const router = express.Router();
const apiRouter = require("../routes/api");

router.use("/api", apiRouter);
module.exports = router;
