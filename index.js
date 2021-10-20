const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const dbStarter = require("./models");
const config = require("./config");
const appRouter = require("./routes");
const logging = require("./logging");

const VM = process.env.ENV;
(async () => {
  console.log("I AM RUNNING ON:", VM ? VM : "localhost");

  // Connecting to MongoDB
  await dbStarter.connectToDatabase();
  // Using cors for cross origin requests
  app.use(cors({ credentials: true, origin: config.cors }));
  // Logging middleware
  app.use(logging.middleware);
  // For baseurl request, respond with the minimal server information.
  app.get(/^\/$/, (req, res) => {
    res.json({
      name: package.name,
      version: package.version,
    });
  });
  // Using body parser to parse the data we receive to this api for convenience
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(bodyParser.json({ limit: "100mb" }));
  // For baseurl request, respond with the minimal server information.
  app.use("/", appRouter);

  http.listen(config.port, () => {
    console.log("Server is running on port " + config.port);
  });
})();
