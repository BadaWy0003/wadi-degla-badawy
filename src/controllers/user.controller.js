const UserService = require("../services/user.service");
const UserController = {};

UserController.createUser = async (req, res) => {
  try {
    const data = await UserService.createUser(req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

UserController.getCurrentUser = async (req, res) => {
  try {
    const data = await UserService.getUserByIdAndExcludePassword(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

UserController.getAllUser = async (req, res) => {
  try {
    const data = await UserService.fetchAllUser();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

UserController.getUserById = async (req, res) => {
  try {
    const data = await UserService.getUserById(req.params.userId);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

UserController.putCurrentUser = async (req, res) => {
  try {
    const response = await UserService.currentUserUpdate(req.user.id, req.body);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = UserController;
