const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/key");
const passport = require("passport");

//load imput validation

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//load user model
const User = require("../../models/User");
// @route GET api/Profile/test
// @desc Tests profile route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "Users Works!" }));
// @route GET api/Profile/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, IsValid } = validateRegisterInput(req.body);
  //check validation
  if (!IsValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "Email already exists!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm", //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
// @route GET api/Users/Login
// @desc login user / returning the jwt
// @access Public
router.post("/login", (req, res) => {
  const { errors, IsValid } = validateLoginInput(req.body);
  //check validation
  if (!IsValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "user not found";
      res.status(404).json({ email: "user not found" });
    }
    //check password!
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Matched

        //payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        //Sign Token
        jwt.sign(
          payload,
          key.secretOrkey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        res.status(400).json(errors);
      }
    });
  });
});
// @route GET api/Users/Current
// @desc Current user / returning the current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
module.exports = router;
