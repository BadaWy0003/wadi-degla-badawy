const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userAuth = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.get("/me", userAuth, UserController.getCurrentUser);

router.get("/all", userAuth, authorize("ADMIN"), UserController.getAllUser); // Admin authorization

router.get("/:userId", userAuth, authorize("ADMIN"), UserController.getUserById); // Admin authorization

router.put("/me/edit", userAuth, UserController.putCurrentUser);
module.exports = router;
