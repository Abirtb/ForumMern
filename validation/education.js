//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : ""; //? if and : else
  data.degree = !isEmpty(data.degree) ? data.degree : ""; //? if and : else
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ""; //? if and : else

  data.from = !isEmpty(data.from) ? data.from : ""; //? if and : else

  if (validator.isEmpty(data.school)) {
    errors.school = "school is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree is required";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "from is required";
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};
