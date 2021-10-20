const User = require("../models/user");
const crypto = require("crypto");
const { to } = require("../utils");

exports.getUsers = async (
  filters = {},
  query = { _end: 10, _order: "ASC", _sort: "createdAt", _start: 0 }
) => {
  // _end=10&_order=ASC&_sort=id&_start=0
  const { _start, _sort, _order, _end } = query;
  try {
    const data = await User.aggregate([
      {
        $facet: {
          result: [
            { $match: filters },
            {
              $sort: {
                [_sort]: String(_order).toLowerCase() === "asc" ? 1 : -1,
              },
            },
            { $skip: _start * 1 },
            { $limit: _end * 1 },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);
    data[0].total = data[0].total[0].count;
    return data[0];
  } catch (error) {
    throw new Error("Could not get users");
  }
};

exports.getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error("Could not get user by id");
  }
};

exports.getUserByPhone = async (phoneNumber) => {
  try {
    return await User.findOne({ phoneNumber }).populate(
      "businessDetails faceImage"
    );
  } catch (error) {
    throw new Error("Could not get user by id");
  }
};

exports.getUserByToken = async (token) => {
  try {
    return await User.findOne({ token });
  } catch (error) {
    throw new Error("Could not get user by id");
  }
};

exports.updateUserById = async (userId, updates) => {
  try {
    await User.findByIdAndUpdate(userId, updates);
    return await this.getUserById(userId);
  } catch (error) {
    throw new Error("Could not update user by id");
  }
};

exports.deleteUserById = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
    return;
  } catch (error) {
    throw new Error("Could not delete user by id");
  }
};

exports.createUser = async (user) => {
  try {
    const emailExists = await this.checkIfUserEmailExists(user.email);
    if (emailExists) {
      throw new Error("Email already exists");
    }
    const createdUser = await User.create(user);
    const token = this.generateToken();
    createdUser.token = token;
    await createdUser.save();
    return createdUser;
  } catch (error) {
    console.log("error creating user", error);
    throw new Error("Could not create user");
  }
};

exports.checkIfUserEmailExists = async (email) => {
  if (!email) return false;
  const [err, data] = await to(User.findOne({ email }));
  if (err) {
    console.log("error checking user email", error);
    throw new Error("Could not check email");
  }
  if (data && data.length > 0) return true;
  else return false;
};


exports.generateToken = () => {
  let token = crypto.randomBytes(60).toString("hex");
  return token;
};
