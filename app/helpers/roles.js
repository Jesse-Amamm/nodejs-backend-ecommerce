const User = require("../models/user");

exports.getUserRoles = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user.role) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const role = await user.role;
    console.log(role+" c")
    return role;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
