var mongoose = require('mongoose');
var crypto = require('crypto');
var tools = require('../lib/tools');
var debug = require('debug')('api:User');
ObjectId = mongoose.Schema.Types.ObjectId;

var Assignment = require('./data.js').Assignment;
var Homework = require('./data.js').Homework;
var Class = require('./data.js').Class;
var Group = require('./data.js').Group;

var UserSchema = require('./data.js').UserSchema;
var User = require('./data.js').User;


// var Post = require('./Post.js');
// var UserSchema = new mongoose.Schema({
//   account: {type:String,default: null,index:true},
//   password: {type:String,default: null},
//   email: {type:String,default: null},
//   name: {type: String, default: null},
//   position: {type: String, default: null}, // teaccher, student, assistant
//   homeworks: [ObjectId],
//   classroom: {type: ObjectId, default: null},
//   group: {type: ObjectId, default: null},
// });




// UserSchema.set('autoIndex', false);

//methods
// UserSchema.methods.speak = function () {
//   console.log(this.name);
// };
//global function
// function detectUserExist (userData) {
//   debug(userData);
//   return userData? Promise.resolve(userData) : Promise.reject('该用户不存在');
// }
// function detectPostExist (postData) {
//   return postData? Promise.resolve(postData) : Promise.reject('该blog不存在');
// }
// function detectCommentExist (commentData) {
//   return commentData? Promise.resolve(commentData) : Promise.reject('该评论不存在');
// }

// //static methods

// UserSchema.statics.findUserByAccount = function(userAccount) {
//   debug(userAccount);
//   return this.findOne({account: userAccount})
//              .then(detectUserExist, (err) => {
//                debug(err);
//                return Promise.reject('该用户不存在')
//              });
// }

// // PostSchema.statics.findPostById = function(postId) {
// //   return this.findOne({_id: PostId})
// //              .then(detectPostExist, (err) => {
// //                 debug(err);
// //                 return Promise.reject('该blog不存在');
// //              });
// // }
// // PostSchema.statics.findCommentById = function(postId, commentId) {
// //   return this.findPostById(postId)
// //              .then(postData => postsData.comments.id(commentId))
// //              .then(detectCommentExist, (err) => {
// //                 debug(err);
// //                 return Promise.reject('该评论不存在');
// //              })
// // }
// UserSchema.statics.register = function (account, password, name, beManager) {
//     var promise
//     = this.find({account:account})
//           .count()
//           .then(
//             (number) => {
//               if (number === 0) {
//                 var hashedPassword = crypto.createHash('sha1')
//                                           .update(password)
//                                           .digest('base64');
//                 var user = User({account: account, password: hashedPassword, name: name});
//                 if (beManager) {
//                   user.isManager = true;
//                 }
//                 user.save(tools.invalidDataHandler);
//                 return Promise.resolve('注册成功');
//               } else {
//                 return Promise.reject('账号已被注册');
//               }
//             },
//             (err) => Promise.reject(err.message)
//           );
//     return promise;
// };
// UserSchema.statics.login = function (account, password) {
//     var hashedPassword = crypto.createHash('sha1')
//                                  .update(password)
//                                  .digest('base64');
//     var promise
//     = this.findOne({account:account, password: hashedPassword}, {password:0})
//           .then(
//             (userData) => {
//               if (!userData) {
//                 return Promise.reject('账号或密码错误');
//               }
//               userData.posts = forbiddenFilter(userData.posts).sort((a,b) => b.lastModified - a.lastModified);
//               return Promise.resolve(userData);
//             },
//             (err) => Promise.reject(err.message)
//           );
//     return promise;
// };
// UserSchema.statics.alreadyLogin = function (account) {
//     var promise
//     = this.findOne({account:account}, {password:0})
//           .then(
//             (userData) => {
//               if (!userData) {
//                 return Promise.reject('...');
//               }
//               userData.posts = forbiddenFilter(userData.posts).sort((a,b) => b.lastModified - a.lastModified);
//               return Promise.resolve(userData);
//             },
//             (err) => Promise.reject(err.message)
//           );
//     return promise;
// };
// UserSchema.statics.addPost = function (account, title, content, name) {
//   var that = this;
//   var promise
//     = this.findOne({account:account})
//           .then(
//             (userData) => {
//               if (!userData) {
//                 return Promise.reject('没有该账号');
//               }
//               var newPost = {};
//               newPost.ownerAccount = account;
//               newPost.title = title;
//               newPost.content = content;
//               newPost.ownerName = name;
//               userData.posts.unshift(newPost);
//               return userData.save().then(
//                 (userData) => Post.addPost(userData.posts[0]),
//                 (err) => Promise.reject(err.message)
//               );
//             },
//             (err) => Promise.reject(err)
//           );
//     return promise;
// };
// UserSchema.statics.editPost = function (account, id, title, content) {
//   var that = this;
//   var promise
//     = this.findOne({account:account})
//           .then(
//             (userData) => {
//               if (!userData) {
//                 return Promise.reject('没有该账号');
//               }
//               var postData = userData.posts.id(id);
//               if (!postData) {
//                 return Promise.reject('没有该blog');
//               }
//               if (postData.isForbidden) {
//                 return Promise.reject('该blog已经被禁');
//               }
//               postData.title = title;
//               postData.content = content;
//               postData.lastModified = Date.now();
//               return userData.save().then(
//                 (userData) => Post.editPost(postData),
//                 (err) => Promise.reject(err.message)
//               );
//             },
//             (err) => Promise.reject(err)
//           );
//     return promise;
// };
// UserSchema.statics.deletePost = function (account, id) {
//   var that = this;
//   var promise
//     = this.findOne({account:account})
//           .then(
//             (userData) => {
//               if (!userData) {
//                 return Promise.reject('没有该账号');
//               }
//               var postNeedToDelete = userData.posts.id(id);
//               debug(postNeedToDelete);
//               if (postNeedToDelete) {
//                 return Promise.resolve(postNeedToDelete.remove()).then(
//                   (value) => userData.save().then(
//                             (userData) => Post.deletePost(id),
//                             (err) => Promise.reject(err.message)
//                           ),
//                   (err) => Promise.reject(err.message)
//                 )
//               } else {
//                 return Promise.reject('该blog不存在');
//               }
//             },
//             (err) =>  Promise.reject(err.message)
//           );
//     return promise;
// };
// UserSchema.statics.addComment = function(commentOwnerAccount ,postId, commentContent, commentOwnerName) {
//   var that = this;
//   return Post.findOne({_id: postId}).then((postData) => that.findOne({account:postData.ownerAccount}))
//                              .then((userData) => {
//                                 var postData = userData.posts.id(postId);
//                                 if (!postData) {
//                                   return Promise.reject('该blog不存在');
//                                 }
//                                 // if (postData.isForbidden) {
//                                 //   return Promise.reject('该blog已经被禁');
//                                 // }
//                                 debug(postData);
//                                 postData.comments.push({ownerAccount: commentOwnerAccount, content: commentContent, ownerName: commentOwnerName});
//                                 return userData.save().then(() => postData);
//                              })
//                              .then((postData) => Post.addComment(postId, postData.comments[postData.comments.length -1]),
//                                    (err) => {debug(err);return Promise.reject('添加评论失败');});
// }
// UserSchema.statics.editComment = function(commentOwnerAccount ,postId, commentId, commentContent) {
//   var that = this;
//   return Post.findOne({_id: postId}).then((postData) => that.findOne({account:postData.ownerAccount}))
//                              .then((userData) => {
//                                 var postData = userData.posts.id(postId);
//                                 if (!postData) {
//                                   return Promise.reject('该blog不存在');
//                                 }
//                                 debug(postData);
//                                 var commentData = postData.comments.id(commentId);
//                                 if (!commentData) {
//                                   return Promise.reject('该评论不存在');
//                                 }
//                                 if (commentData.ownerAccount !== commentOwnerAccount) {
//                                   return Promise.reject('该评论不属于你');
//                                 }
//                                 commentData.content = commentContent;
//                                 commentData.lastModified = Date.now();
//                                 return userData.save().then(() => commentData);
//                              })
//                              .then((commentData) => Post.editComment(postId, commentData),
//                                    (err) => {
//                                     debug(err);
//                                     if (typeof err === 'string') {
//                                       return Promise.reject(err);
//                                     }
//                                     return Promise.reject('修改评论失败');});
// }
// UserSchema.statics.deleteComment = function(commentOwnerAccount ,postId, commentId) {
//   var that = this;
//   return Post.findOne({_id: postId}).then((postData) => that.findOne({account:postData.ownerAccount}))
//                              .then((userData) => {
//                                 var postData = userData.posts.id(postId);
//                                 if (!postData) {
//                                   return Promise.reject('该blog不存在');
//                                 }
//                                 debug(postData);
//                                 var commentData = postData.comments.id(commentId);
//                                 if (!commentData) {
//                                   return Promise.reject('该评论不存在');
//                                 }
//                                 if (commentData.ownerAccount !== commentOwnerAccount) {
//                                   return Promise.reject('该评论不属于你');
//                                 }
//                                 return Promise.resolve(commentData.remove())
//                                               .then(() => userData.save())
//                              })
//                              .then(() => Post.deleteComment(postId, commentId),
//                                    (err) => {
//                                     debug(err);
//                                     if (typeof err === 'string') {
//                                       return Promise.reject(err);
//                                     }
//                                     return Promise.reject('删除评论失败');});
// }

// UserSchema.statics.getPosts = function(account) {
//   var promise
//   = this.findOne({account:account}, {posts:1})
//         .then(
//           (postsData) =>Promise.resolve(postsData),
//           (err) => Promise.reject(err)
//         );
//   return promise;
// };

// UserSchema.statics.switchForbiddenPost = function(postOwnerAccount, postId) {
//   return this.findOne({account: postOwnerAccount})
//              .then((userData) => {
//                if (!userData) {
//                 return Promise.reject('该blog作者不存在');
//                }
//                var postData = userData.posts.id(postId);
//                postData.isForbidden = !postData.isForbidden;
//                return userData.save().then(
//                 () => Promise.resolve(postForbiddenFilter(postData)),
//                 (err) => {
//                   debug(err);
//                   return Promise.reject('禁blog改变失败');
//                 }
//                )
//              });
// }
// UserSchema.statics.switchForbiddenComment = function(userAccount, postId, commentId) {
//   var outsideUserData;
//   return this.findUserByAccount(userAccount)
//              .then(userData => {outsideUserData = userData; return userData.posts.id(postId)})
//              .then(detectPostExist)
//              .then(postData => postData.comments.id(commentId))
//              .then(detectCommentExist)
//              .then(commentData => {
//                commentData.isForbidden = !commentData.isForbidden;
//                return outsideUserData.save().then(() => commentData);
//              })
//              .then((commentData) => commentForbiddenFilter(commentData),
//                    (err) => {debug(err);throw '禁评论改变失败'});
// }

// function forbiddenFilter(postsData) {
//   return postsData.map((postData) => {
//     if (postData.isForbidden) {
//       postData.title = '该blog已经被管理员禁了';
//       postData.content = '';
//     }
//     postData.comments = postData.comments.map((commentData) => {
//       if (commentData.isForbidden) {
//         commentData.content = '该评论已经被管理员禁了';
//       }
//       return commentData;
//     })
//     return postData;
//   })
// }
// // User is the only way to the outside, so I don't use this in Post.js
// function postForbiddenFilter(postData) {
//   if (postData.isForbidden) {
//     postData.title = '该blog已经被管理员禁了';
//     postData.content = '';
//   }
//   postData.comments = postData.comments.map((commentData) => {
//       if (commentData.isForbidden) {
//         commentData.content = '该评论已经被管理员禁了';
//       }
//       return commentData;
//     })
//   return postData;
// }
// function commentForbiddenFilter(commentData) {
//   if (commentData.isForbidden) {
//     commentData.content = '该评论已经被管理员禁了';
//   }
//   return commentData;
// }
// //Model
// var User = mongoose.model('User', UserSchema);

module.exports = User;