//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : ""; //? if and : else
  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 3000 characters ";
  }

  if (validator.isEmpty(data.text)) {
    errors.text = "text field is required";
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};

