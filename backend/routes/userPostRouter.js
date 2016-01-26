//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:userPost');
//self
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var User = require('../database/User');
var Post = require('../database/Post');

var express = require('express');
var router = express.Router();
/* GET home page. */
router.use(tools.checkLoginMiddleware);

router.post('/post', tools.validateMiddleware(validator.validatePost.bind(validator)), function addPost(req, res) {
  // res.setHeader('Content-type','application/json');
  User.addPost(req.session.userData.account, req.body.title, req.body.content, req.session.userData.name).then(
    (postData) => {
      debug(postData);
      res.json({error: false, postData: postData});
    },
    (errorMessage) => {
      debug(errorMessage);
      res.json({error: true, message: errorMessage});
    }
  );
});
router.get('/posts', function getPosts(req, res) {
  res.setHeader('Content-type','application/json');
  debug(req.query.query);
  Post.getPosts(req.query.query).then(
    (postsDataAndTotal) => {
      debug(postsDataAndTotal);
      res.json({error: false,
                postsData: postsDataAndTotal.postsData,
                total: postsDataAndTotal.total,
                eachPage: postsDataAndTotal.eachPage});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  );
});

// router.get('/posts', function getPosts(req, res) {
//   res.setHeader('Content-type','application/json');
//   Post.getPosts().then(
//     (postsData) => {
//       debug(postsData);
//       res.json({error: false, postsData: postsData});
//     },
//     (errorMessage) => {
//       res.json({error: true, message: errorMessage});
//     }
//   );
// });
router.put('/post/:postId', tools.validateMiddleware(validator.validatePost.bind(validator)), function editPost(req, res) {
  User.editPost(req.session.userData.account, req.params.postId, req.body.title, req.body.content).then(
    (postData) => {
      debug(postData);
      res.json({error: false, postData: postData});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  )
});
router.delete('/post/:postId', function deletePost(req, res) {
  User.deletePost(req.session.userData.account, req.params.postId).then(
    (successMessage) => {
      debug(successMessage);
      res.json({error: false, message: successMessage});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  )
});
router.post('/post/:postId/comment', tools.validateMiddleware(validator.validateComment.bind(validator)), function addComment(req, res) {
  User.addComment(req.session.userData.account, req.params.postId, req.body.content, req.session.userData.name).then(
    (commentData) => {
      debug(commentData);
      res.json({error: false, commentData: commentData});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  );
});
router.put('/post/:postId/comment/:commentId', tools.validateMiddleware(validator.validateComment.bind(validator)), function editComment(req, res) {
  User.editComment(req.session.userData.account, req.params.postId, req.params.commentId, req.body.content).then(
    (commentData) => {
      debug(commentData);
      res.json({error: false, commentData: commentData});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  );
});
router.delete('/post/:postId/comment/:commentId', function deleteComment(req, res) {
  User.deleteComment(req.session.userData.account, req.params.postId, req.params.commentId).then(
    (successMessage) => {
      debug(successMessage);
      res.json({error: false, message: successMessage});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  )
});
module.exports = router;