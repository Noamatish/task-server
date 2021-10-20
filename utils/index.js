const moment = require("moment");
const User = require("../models/user");

exports.getMonthRange = function () {
  let startDate = moment().startOf("day").subtract(1, "month").startOf("day");
  let endDate = moment().startOf("day").subtract(1, "days").startOf("day");
  const minDate = moment("2018-09-01").startOf("day");
  if (minDate.isAfter(startDate)) {
    startDate = minDate;
  }

  startDate = startDate.format("YYYY-MM-DD");
  endDate = endDate.format("YYYY-MM-DD");
  return [startDate, endDate];
};

exports.today = () => {
  // let today = moment().subtract(180, 'minutes').format('YYYY-MM-DD');
  let today = moment().format("YYYY-MM-DD");
  return today;
};

exports.now = () => {
  // let today = moment().subtract(180, 'minutes').format('YYYY-MM-DD');
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  return now;
};

module.exports.isObjectEmpty = function (obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};

module.exports.getDateRange = function (date) {
  var momentDate = moment.unix(date);
  var REFERENCE = moment().subtract(1, "days").startOf("day");
  var TODAY = REFERENCE.clone().startOf("day");
  var YESTERDAY = REFERENCE.clone().subtract(1, "days").startOf("day");
  var A_WEEK_OLD = REFERENCE.clone().subtract(7, "days").startOf("day");
  var A_MONTH_OLD = REFERENCE.clone().subtract(30, "day").startOf("day");

  var ranges = [];
  if (momentDate.isSame(TODAY, "d")) {
    ranges.push("daily");
  }
  if (momentDate.isAfter(A_WEEK_OLD)) {
    ranges.push("weekly");
  }
  if (momentDate.isAfter(A_MONTH_OLD)) {
    ranges.push("monthly");
  }

  return ranges;
};

module.exports.isOnSameDay = function (date1, date2) {
  var momentDate1 = moment(date1);
  var momentDate2 = moment.unix(date2);

  return momentDate1.isSame(momentDate2, "d");
};

module.exports.convertToDate = function (date) {
  return moment.unix(date).toDate();
};

// Helper function for handling errors with async/await without try/catch
exports.to = (promise) => {
  return promise
    .then(function (data) {
      return [null, data];
    })
    .catch(function (err) {
      return [err, undefined];
    });
};

/**
 *
 * @param {string} phone phone number to validate and prettify
 * @returns {string} prettier number
 */
exports.phoneNumberPrettier = (phone) => {
  try {
    // trimming
    phone = String(phone).replace(/\s/g, "");
    const countryCode = String(phone).substr(0, 5);
    // israeli checking and removing redundant 0
    if (countryCode === "+9720") {
      phone = phone.replace("+9720", "+972");
    }
    return phone;
  } catch (error) {
    return phone;
  }
};

exports.updateUsersPhoneNumber = async () => {
  const users = await User.find({ phoneNumber: { $exists: true } });
  for (const user of users) {
    try {
      await user.update({
        phoneNumber: this.phoneNumberPrettier(user.phoneNumber),
      });
    } catch (error) {
      console.log("error updating numbers", error);
    }
  }
};

// uncomment to run
// this.updateUsersPhoneNumber();
