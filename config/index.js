const merge = require("lodash.merge");

// const env = process.env.NODE_ENV || 'development'
let en = process.env.ENV;
const env = en ? en : "development";

const baseConfig = {};

let envConfig = {};

switch (env) {
  case "development":
    envConfig = require("./dev.env");
    break;
  case "production":
    envConfig = require("./prod.env");
    break;
  case "test":
    envConfig = require("./test.env");
    break;
  default:
    envConfig = require("./dev.env");
}

module.exports = merge(baseConfig, envConfig);
