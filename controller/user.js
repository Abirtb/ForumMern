const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const key = require("../config/key");
const passport = require("passport");

const gravatar = require("gravatar");

const Register = async (req, res) => {
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
};
const Login = async (req, res) => {
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
          { expiresIn: 22222222222222222222 },
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
};

module.exports = { Register, Login };
