var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var timestamps = require("mongoose-timestamp");

var emailSchema = new Schema({
email: {
    type: String
  },
  body: {
      type: String
  },
  url: {
    type: String,
  },
  clicked: {
    type: Boolean,
    default: false,
  },
});

emailSchema.plugin(timestamps);

module.exports = mongoose.model("Email", emailSchema);