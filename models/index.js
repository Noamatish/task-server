const mongoose = require("mongoose");
const config = require("../config");
const logging = require("../logging");

module.exports.connectToDatabase = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on("error", function () {
      logging.error(
        "MongoDB Connection Error. Please make sure that MongoDB is running."
      );
      reject();
    });

    mongoose.connection.on("connected", function () {
      resolve();
      logging.info(
        "Successfully connected to MongoDB. DB Name: " +
          mongoose.connection.name
      );
    });
  });
