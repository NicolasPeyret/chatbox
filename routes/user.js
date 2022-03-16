const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/token", userCtrl.getToken);
router.get("/user", userCtrl.getUser);

module.exports = router;
