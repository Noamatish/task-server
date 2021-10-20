var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var timestamps = require("mongoose-timestamp");
const bcrypt = require("bcrypt-nodejs");

var UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  fullName: {
    type: String,
    trim: true,
  },
});

//hashing user's password before creating it.
UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    return next();
  });
});

UserSchema.plugin(timestamps);

module.exports = mongoose.model("User", UserSchema);
