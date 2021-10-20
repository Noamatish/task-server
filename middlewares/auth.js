const User = require("../models/user");
const errors = require("../errors");
const { to } = require("../utils");
const { getUserByToken } = require("../services/user");

exports.tokenMiddleware = () => async (req, res, next) => {
  const token = req.headers["token"] || req.query.token;
  // Missing token
  if (!token || token.length !== 120) {
    return errors.handler(
      req,
      res
    )(new errors.UnauthenticatedAccess("Missing token"));
    // We have a token
  } else {
    const query = User.findOne().where("token").equals(token).select("+token");

    const [err, user] = await to(getUserByToken(token));

    if (err) return errors.handler(req, res)(err);
    if (!user)
      return errors.handler(
        req,
        res
      )(new errors.UnauthenticatedAccess("Token is invalid"));

    req.user = user;
    next();
  }
};

exports.force_https = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.get("host") + req.url);
    }
  }
  next();
};
