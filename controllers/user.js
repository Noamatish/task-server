const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const { createUser } = require("../services/user");
const User = require("../models/user");
const { to, phoneNumberPrettier } = require("../utils");

exports.check = async (req, res) => {
  console.log('hi');
  res.send('hi')
}

//Exmaple with Async function
exports.register = async (req, res) => {
  const user = req.body;
  try {
    const createdUser = await createUser(user);
    res.send(createdUser);
  } catch(err){
    res.status(500).send(err)
  }
};

// Exmaple with promise then
exports.login = (req, res) => {
  const { email, password } = req.body;
    User.findOne()
      .where("email")
      .equals(email.toLowerCase())
      .exec()
      .then((user) => {
        if (!user) {
         return res.status(401).send('No user found')
        }
        // Comparing the passwords
        bcrypt.compare(password, user.password, function (err, valid) {
          if (!valid) {
            return res.status(404).send('No user found')
          } else if (err) {
            console.log('err validating password', err)
            return res.status(404).send('No user found')
          }
          if (!user.token) {
            user.token = crypto.randomBytes(60).toString("hex");
          }
          user
            .save()
            .then((loginUser) => {
              res.json(loginUser);
            })
            .catch((err) => {
              console.log('err login user', err)
            return res.status(500).send('No user found')
            });
        });
      })
};

exports.logout = async (req, res) => {

}

exports.me = (req, res) => {
  req.user = req.user.toObject();
  res.json(req.user);
};