//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : ""; //? if and : else
  data.password = !isEmpty(data.password) ? data.password : ""; //? if and : else

  if (validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email is required";
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};
