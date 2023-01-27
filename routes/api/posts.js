const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/profile");

const auth = passport.authenticate("jwt", { session: false });
//validation:
const validatePostInput = require("../../validation/post");
//@route GET api/posts/test
//@desc Tests post route
//@access Public

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//@route GET api/posts
//@desc get post
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostfount: "no post found " }));
});
//@route GET api/posts
//@desc get post
//@access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch((err) =>
      res.status(404).json({ nopostfount: "no post found with that id " })
    );
});

//@route GET api/posts
//@desc Create post
//@access Private
router.post("/", auth, (req, res) => {
  const { errors, IsValid } = validatePostInput(req.body);
  if (!IsValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,

    user: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar,
  });
  newPost.save().then((post) => res.json(post));
});
//@route delete api/posts/:id
//@desc delete post
//@access Private
router.delete("/:id", auth, (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "user not authorized" });
        }
        //delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch((err) => res.status(404).json({ postnotfound: "post not found" }));
  });
});
//@route delete api/posts/like/:id
//@desc like post
//@access Private
router.post("/like/:id", auth, (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "this post is already liked by this user" });
        }
        //add the user id to the likes array
        post.likes.unshift({ user: req.user.id });
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "post not found" }));
  });
});
//@route delete api/posts/like/:id
//@desc like post
//@access Private
router.post("/unlike/:id", auth, (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length == 0
        ) {
          return res
            .status(400)
            .json({ notliked: "you have not yet liked this post" });
        }
        //get remove index
        const removeIndex = post.likes
          .map((item) => item.user.toString())
          .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        //save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "post not found" }));
  });
});
//@route delete api/posts/comment/:id
//@desc comment post
//@access Private
router.post("/comment/:id", auth, (req, res) => {
  const { errors, IsValid } = validatePostInput(req.body);
  if (!IsValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id,
      };
      /// add to comments array
      post.comments.unshift(newComment);
      //save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: "no post found" }));
});
//@route delete api/posts/uncomment/:id/:comment_id
//@desc delete comment post
//@access Private
router.delete("/uncomment/:id/:comment_id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (
        post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ notcommented: "you have not commented this post" });
      }

      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);
      //save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: "no post found" }));
});
module.exports = router;
