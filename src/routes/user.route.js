const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userAuth = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.post(
  "/create",
  userAuth,
  authorize("SUPER_ADMIN"),
  UserController.createUser
);

router.delete(
  "/delete/:userId",
  userAuth,
  authorize("SUPER_ADMIN"),
  UserController.deleteUser
);

router.get("/me", userAuth, UserController.getCurrentUser);

router.get(
  "/all",
  userAuth,
  authorize("SUPER_ADMIN"),
  UserController.getAllUser
);

router.put("/me/edit", userAuth, UserController.putCurrentUser);

router.get(
  "/:userId",
  userAuth,
  authorize("ADMIN"),
  UserController.getUserById
);

module.exports = router;