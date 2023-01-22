//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : ""; //? if and : else
  data.email = !isEmpty(data.email) ? data.email : ""; //? if and : else
  data.password = !isEmpty(data.password) ? data.password : ""; //? if and : else
  data.password2 = !isEmpty(data.password2) ? data.password2 : ""; //? if and : else

  if (!validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "Name must be between 3 and 30 characters!";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "namefield is required";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email is required";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password must be at least 6 characters ";
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password = "password must match ";
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};
