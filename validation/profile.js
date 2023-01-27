//import isEmpty from "./is-empty";
const isEmpty = require("./is-empty");
const validator = require("validator");
module.exports = function validateProfileInput(data) {
  console.log(data.website);
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : ""; //? if and : else
  data.status = !isEmpty(data.status) ? data.status : ""; //? if and : else
  data.skills = !isEmpty(data.skills) ? data.skills : ""; //? if and : else

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle needs to between 2 and 4 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "profile handle is required";
  }
  if (validator.isEmpty(data.status)) {
    errors.status = "profile status is required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "skills field is required";
  }
  if (!isEmpty(data.website)) {
    console.log(555);
    if (!validator.isURL(data.website)) {
      errors.website = "not a valid url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "not a valid url";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "not a valid url";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "not a valid url";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "not a valid url";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "not a valid url";
    }
  }

  return {
    errors,
    IsValid: isEmpty(errors),
  };
};
