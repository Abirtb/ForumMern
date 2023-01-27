//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : ""; //? if and : else
  data.company = !isEmpty(data.company) ? data.company : ""; //? if and : else
  data.from = !isEmpty(data.from) ? data.from : ""; //? if and : else

  if (validator.isEmpty(data.title)) {
    errors.title = "title is required";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "company is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "from is required";
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};
