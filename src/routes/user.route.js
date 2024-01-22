const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const userAuth = require("../middlewares/auth.middleware");

router.get("/me", userAuth, UserController.getCurrentUser);

router.get("/all", UserController.getAllUser); // Admin authorization

router.get("/:userId", UserController.getUserById); // Admin authorization

router.put("/me/edit", userAuth, UserController.putCurrentUser);
module.exports = router;
