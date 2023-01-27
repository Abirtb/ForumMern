const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load profile model
const Profile = require("../../models/profile");
//load user model
const user = require("../../models/User");

//Controllers
const { findProfile, AllProfile, ProfileByHandle,ProfileById,CreateOrEditProfile,CreateExperience,CreateEducation,DeleteExperience,DeleteEducation,DeleteAll
} = require("../../controller/profile");


//middlewares
const auth = passport.authenticate("jwt", { session: false });

// @route GET api/profile/test
// @desc Tests profile route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "profile works" }));

// @route GET api/profile
// @desc get current user profile
// @access Private
router.get("/", auth, findProfile);
// @route GET api/profile/all
// @desc get  all profiles
// @access public
router.get("/all", AllProfile);


// @route GET api/profile/handle/:handle
// @desc get profile by handle
// @access public

router.get("/handle/:handle",ProfileByHandle );

// @route GET api/profile
// @desc create or edit user profile
// @access private
router.get("/user/:user_id",ProfileById);
router.post( "/",auth, CreateOrEditProfile )
// @route GET api/profile/experience
// @desc add experience to profile
// @access private
router.post("/experience",auth,CreateExperience);
// @route GET api/profile/Education
// @desc add Education to profile
// @access private
router.post("/education",auth,CreateEducation);
router.delete("/Experience/:exp_id",auth,DeleteExperience);
router.delete("/Education/:edu_id",auth,DeleteEducation
);
router.delete("/",auth,DeleteAll);



module.exports = router;
