const userService = require("../services/userService");

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      const err = new Error("email, password, and name are required");
      err.statusCode = 400;
      throw err;
    }

    const user = await userService.createUser({ email, password, name });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      const notFoundError = new Error("User not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
