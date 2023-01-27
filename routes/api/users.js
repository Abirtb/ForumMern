const express = require("express");
const router = express.Router();

const passport = require("passport");

const { Register, Login } = require("../../controller/user");

const auth = passport.authenticate("jwt", { session: false });

// @route GET api/Profile/test
// @desc Tests profile route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "Users Works!" }));
// @route GET api/Profile/register
// @desc Register user
// @access Public
router.post("/register", Register);
// @route GET api/Users/Login
// @desc login user / returning the jwt
// @access Public

router.post("/login", Login);

// @route GET api/Users/Current
// @desc Current user / returning the current user
// @access Private
router.get("/current", auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
