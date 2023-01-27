const Profile = require("../models/profile");
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");

const findProfile = async (req, res) => {
  const errors = {};

  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      errors.noprofile = "there is no profile for this user";
      return res.status(404).json(errors);
    }

    res.json(profile);
  } catch (err) {
    res.status(404).json(err);
  }
};
const AllProfile = async (req, res) => {
  const errors = {};
  try {
    let profiles = await Profile.find();
    if (!profiles) {
      errors.noprofile = "there is no profiles";
      return res.status(404).json(errors);
    }

    res.json(profiles);
  } catch (err) {
    res.status(404).json(err);
  }
};
const ProfileByHandle = async (req, res) => {
  const errors = {};
  try {
    let profile = await Profile.findOne({ handle: req.params.handle }).populate(
      "user",
      ["name", "avatar"]
    )((profile) => {
      if (!profile) {
        errors.noprofile = "there is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

// @route GET api/profile/user/:user_id
// @desc get profile by user id
// @access public

const ProfileById = async (req, res) => {
  const errors = {};
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      errors.noprofile = "there is no profile for this user";
      res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    res.status(404).json({ profile: "there is no profile for this user" });
  }
};

const CreateOrEditProfile = async (req, res) => {
  const { errors, IsValid } = validateProfileInput(req.body);

  //check validation
  if (!IsValid) {
    return res.status(400).json(errors);
  }
  //get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  if (req.body.date) profileFields.date = req.body.date;
  //skills -spli into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }
  //social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      //update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then((profile) => res.json(profile));
    } else {
      //create

      //check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then((profile) => {
        if (profile) {
          (errors.handle = "that handle already exists "),
            res.status(400).json(errors);
        }
        //save profile
        new Profile(profileFields).save().then((profile) => res.json(profile));
      });
    }
  });
};
const CreateExperience = async (req, res) => {
  const { errors, IsValid } = validateExperienceInput(req.body);

  //check validation
  if (!IsValid) {
    console.log(11111);
    return res.status(400).json(errors);
  }
  profile = await Profile.findOne({ user: req.user.id });
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  //add to experience array
  profile.experience.unshift(newExp);
  profile = await profile.save();
  res.json(profile);
};
const CreateEducation = async (req, res) => {
  const { errors, IsValid } = validateEducationInput(req.body);

  //check validation
  if (!IsValid) {
    return res.status(400).json(errors);
  }
  profile = await Profile.findOne({ user: req.user.id });
  const newExp = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  //add to education  array
  profile.education.unshift(newExp);
  profile.save().then((profile) => res.json(profile));
};
const DeleteExperience = async (req, res) => {
  try {
    profile = await Profile.findOne({ user: req.user.id });
    //get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    //splice out the array
    if (removeIndex != -1) {
      profile.experience.splice(removeIndex, 1);
    } else {
      return res.status(404).json({ msg: "no experience" });
    }
    //save
    profile.save().then((profile) => res.json(profile));
  } catch (err) {
    res.status(404).json(err);
  }
};
const DeleteEducation = async (req, res) => {
  try {
    profile = await Profile.findOne({ user: req.user.id });
    //get remove index

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    //splice out the array
    if (removeIndex != -1) {
      profile.education.splice(removeIndex, 1);
    } else {
      return res.status(404).json({ msg: "no education" });
    } //save
    profile.save().then((profile) => res.json(profile));
  } catch (err) {
    res.status(404).json(err);
  }
};
const DeleteAll =async (req, res) => {
    try {
      profile = await Profile.findOneAndRemove({ user: req.user.id });
       user=await User.findOneAndRemove ({_id:req.user.id})
       res.json({success:true})
      
      
    } catch (err) {
      res.status(404).json(err);
    }
  };
module.exports = {
    DeleteAll,
  DeleteEducation,
  DeleteExperience,
  CreateEducation,
  CreateExperience,
  CreateOrEditProfile,
  ProfileById,
  ProfileByHandle,
  findProfile,
  AllProfile,
};
