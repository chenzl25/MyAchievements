var mongoose = require('mongoose');
var tools = require('../lib/tools');
var debug = require('debug')('api:Post');
ObjectId = mongoose.Schema.Types.ObjectId;

//sub Schema
var CommentSchema = new mongoose.Schema({
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    ownerName: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Number,default: Date.now, index:true},
});

//parent Schema
var PostSchema = new mongoose.Schema({
    title: {type: String, default: null},
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    ownerName: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Number,default: Date.now},
    comments: [CommentSchema]
});
PostSchema.set('autoIndex', true);
CommentSchema.set('autoIndex', false);

//methods
PostSchema.methods.speak = function () {
  console.log(this.name);
};

// global function
function detectPostExist (postData) {
  return postData? Promise.resolve(postData) : Promise.reject('该blog不存在');
}
function detectCommentExist (commentData) {
  return commentData? Promise.resolve(commentData) : Promise.reject('该评论不存在');
}
//static methods 
PostSchema.statics.findPostById = function(postId) {
  return this.findOne({_id: postId})
             .then(detectPostExist, (err) => {
                debug(err);
                return Promise.reject('该blog不存在');
             });
}
PostSchema.statics.findCommentById = function(postId, commentId) {
  return this.findPostById(postId)
             .then(postData => postData.comments.id(commentId))
             .then(detectCommentExist, (err) => {
                debug(err);
                return Promise.reject('该评论不存在');
             })
}
PostSchema.statics.addPost = function(post) {
  var newPost = Post(post);
  return newPost.save().then(
    postData => Promise.resolve(postData),
    err => Promise.reject(err.message)
  );
};
PostSchema.statics.getPosts = function(query) {
  query = parseInt(query);
  if (query === NaN || query < 1) {
    query = 1;
  }
  var eachPage = 10;
  var total;
  return this.find()
             .count()
             .then(count => {total = count; return query <= Math.ceil(count/eachPage) ? query: Math.ceil(count/eachPage);})
             .then(page => this.find().sort({lastModified: -1}).skip((page-1)*eachPage).limit(eachPage))
             .then(
                (postsData) => Promise.resolve({postsData:forbiddenFilter(postsData), total: total, eachPage: eachPage}),
                (err) => Promise.reject(err.message)
              );
      
  // this.find()
  //       .sort({lastModified: -1})
  //       .then(
  //         (postsData) => Promise.resolve(forbiddenFilter(postsData)),
  //         (err) => Promise.reject(err.message)
  //       );
  // return promise;
};
// PostSchema.statics.getPosts = function() {
//   var promise
//   = this.find()
//         .sort({lastModified: -1})
//         .then(
//           (postsData) => Promise.resolve(forbiddenFilter(postsData)),
//           (err) => Promise.reject(err.message)
//         );
//   return promise;
// };
PostSchema.statics.editPost = function(post) {
  var promise 
  = this.findOne({_id: post._id}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      } else {
        if (postData.isForbidden) {
          return Promise.reject('该blog已经被禁');
        } else {
          postData.title = post.title;
          postData.content = post.content;
          postData.lastModified = post.lastModified;
          return postData.save().then(
            (postData) => Promise.resolve(postData),
            (err) => Promise.reject(err.message)
          )
        }
      }
    },
    (err) => Promise.reject(err.message)
  );
  return promise;
};
PostSchema.statics.deletePost = function(id) {
  return this.remove({_id: id}).then(
    (removeResult) => Promise.resolve('成功删除blog'),
    (err) => Promise.reject(err.message)
  )
};
PostSchema.statics.addComment = function(postId, commentData) {
  return this.findOne({_id: postId}).then(
            (postData) => {
              postData.comments.push(commentData);
              return postData.save().then((postData) => Promise.resolve(postData.comments[postData.comments.length-1]))
            }
          )
};
PostSchema.statics.editComment = function(postId, comment) {
  return this.findOne({_id: postId}).then(
            (postData) => {
              var commentData =  postData.comments.id(comment._id);
              commentData.content = comment.content;
              commentData.lastModified = comment.lastModified;
              return postData.save().then((postData) => Promise.resolve(commentData))
            }
          )
};
PostSchema.statics.deleteComment = function (postId, commentId) {
  return this.findOne({_id: postId}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      }
      var commentData = postData.comments.id(commentId);
      if (!commentData) {
        return Promise.reject('该评论不存在');
      }
      return Promise.resolve(commentData.remove())
                    .then(() => postData.save())
                    .then(() => Promise.resolve('成功删除评论'));
    }
  )
};
PostSchema.statics.switchForbiddenPost = function(postId) {
  return this.findOne({_id: postId}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      }
      postData.isForbidden = !postData.isForbidden;
      return postData.save()
    }
  ).then(
    (postData) => Promise.resolve(postData),
    (err) => {
      debug(err);
      return Promise.reject('禁blog改变失败');
    }
  )
}
PostSchema.statics.switchForbiddenComment = function(postId, commentId) {
  var outsideComment;
  return Promise.all([this.findPostById(postId), this.findCommentById(postId, commentId)])
                .then(values => {
                   var commentData = values[0].comments.id(values[1]._id);
                   commentData.isForbidden = !commentData.isForbidden;
                   outsideComment = commentData;
                   debug(commentData);
                   return values[0].save().then(postData => postData);
                })
                .then((postData) => {debug(postData.comments,'!!');return outsideComment},
                      (err) => {
                        debug(err);
                        return Promise.reject('禁评论改变失败')
                      })
}

function forbiddenFilter(postsDatas) {
  return postsDatas.map((postData) => {
    if (postData.isForbidden) {
      postData.title = '该blog已经被管理员禁了';
      postData.content = '';
    }
    postData.comments = postData.comments.map((commentData) => {
      if (commentData.isForbidden) {
        commentData.content = '该评论已经被管理员禁了';
      }
      return commentData;
    })
    return postData;
  })
}


//Model

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;