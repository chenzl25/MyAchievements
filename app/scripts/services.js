
/* Services */

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('Blog', ['$resource',
  function($resource){
    return $resource('api/post/:postId', {}, {
      query: {method:'GET', params:{phoneId:'posts'}, isArray:true},

    });
  }]);
blogServices.factory('validator',
  function(){
	  var validator = {
			beChecked: {
				userAccount: {
					errorMessage: '用户名6~18位英文字母、数字',
					emptyMessage: '账号为空',
					pattern: /^[a-zA-Z0-9]{6,18}$/
				},
				userPassword: {
					errorMessage: '密码6~18位英文字母、数字',
					emptyMessage: '密码为空',
					pattern: /^[a-zA-Z0-9]{6,18}$/
				},
				userName: {
					errorMessage: '名字长度为2-20个字符',
					emptyMessage: '名字为空',
					pattern: /^.{2,20}$/
				},
				postTitle: {
					errorMessage: 'blog标题长度为2-50个字符',
					emptyMessage: 'blog标题为空',
					pattern: /^.{2,50}$/
				},
				postContent: {
					errorMessage: 'blog内容长度为2-10000个字符',
					emptyMessage: 'blog内容为空',
					pattern: /.{2,10000}/
				},
				commentContent: {
					errorMessage: '评论长度为2-2000个字符',
					emptyMessage: '评论内容为空',
					pattern: /.{2,2000}/
				},
			},
			_validate: function(mapper) {
				var result = "";
				for (var key in mapper) {
					if (mapper[key]) {
						if(!this.beChecked[key].pattern.test(mapper[key]))
							result += this.beChecked[key].errorMessage + '\n';
					} else {
						result += this.beChecked[key].emptyMessage + '\n';
					}
				}
				return result;
			},
			validateRegister: function(input) {
				return this._validate({userAccount:input.account, userPassword: input.password, userName:input.name});
			},
			validateLogin: function(input) {
				return this._validate({userAccount:input.account, userPassword: input.password});
			},
			validatePost: function(input) {
				return this._validate({postTitle: input.title, postContent: input.content});
			},
			validateComment: function(input) {
				return this._validate({commentContent: input.content});
			}
		};
		return validator;
  });
