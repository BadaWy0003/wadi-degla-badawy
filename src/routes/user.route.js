const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userAuth = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.post("/create", userAuth, authorize("ADMIN"), UserController.createUser);

router.get("/me", userAuth, UserController.getCurrentUser);

router.get("/all", userAuth, authorize("ADMIN"), UserController.getAllUser);

router.put("/me/edit", userAuth, UserController.putCurrentUser);

router.get(
  "/:userId",
  userAuth,
  authorize("ADMIN"),
  UserController.getUserById
);

module.exports = router;