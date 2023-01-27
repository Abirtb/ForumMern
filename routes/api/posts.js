const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/profile");

const auth = passport.authenticate("jwt", { session: false });
//@route GET api/posts/test
//@desc Tests post route
//@access Public
const {getpost,getpostbyid,createpost,deletepost,likepost,unlikepost,commentpost, deletecomment }=require("../../controller/posts")
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//@route GET api/posts
//@desc get post
//@access Public
router.get("/",getpost );
//@route GET api/posts
//@desc get post by id 
//@access Public
router.get("/:id", getpostbyid);

//@route GET api/posts
//@desc Create post
//@access Private
router.post("/", auth, createpost);
//@route delete api/posts/:id
//@desc delete post
//@access Private
router.delete("/:id", auth, deletepost );
//@route delete api/posts/like/:id
//@desc like post
//@access Private
router.post("/like/:id", auth, likepost);
//@route delete api/posts/unlike/:id
//@desc like post
//@access Private
router.post("/unlike/:id", auth, unlikepost);
//@route delete api/posts/comment/:id
//@desc comment post
//@access Private
router.post("/comment/:id", auth,commentpost);
//@route delete api/posts/uncomment/:id/:comment_id
//@desc delete comment post
//@access Private
router.delete("/uncomment/:id/:comment_id", auth,deletecomment);
module.exports = router;
