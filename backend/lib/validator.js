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
		userEmail: {
			errorMessage: '邮箱格式错误',
			emptyMessage: '邮箱为空',
			pattern: /^[a-zA-Z0-9]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}$/
		},
		userPosition: {
			errorMessage: '权限格式错误',
			emptyMessage: '权限为空',
			pattern: /^(teacher|student|assistant)$/
		},
		homeworkMessage: {
			errorMessage: '作业附言长度为2-500个字符',
			emptyMessage: '作业附言内容为空',
			pattern: /.{2,500}/
		},
		reviewMessage: {
			errorMessage: '评论长度为2-500个字符',
			emptyMessage: '评论内容为空',
			pattern: /.{2,500}/
		},
		className: {
			errorMessage: '班级名字长度为2-20个字符',
			emptyMessage: '班级名字为空',
			pattern: /^.{2,20}$/
		},
		groupName: {
			errorMessage: '小组名字长度为2-20个字符',
			emptyMessage: '小组名字为空',
			pattern: /^.{2,20}$/
		}
	},
	_validate: function(mapper) {
		var result = [];
		for (var key in mapper) {
			if (mapper[key]) {
				if(!this.beChecked[key].pattern.test(mapper[key]))
					result.push(this.beChecked[key].errorMessage);
			} else {
				result.push(this.beChecked[key].emptyMessage);
			}
		}
		if (result.length == 0)
			return null;
		return result;
	},
	validateMRegister: function(input) {
		return this._validate({userAccount:input.account, userPassword: input.password, userName:input.name, userEmail: input.email});
	},
	validateRegister: function(input) {
		return this._validate({userAccount:input.account, userPassword: input.password, userName:input.name, userPosition: input.position, userEmail: input.email});
	},
	validateLogin: function(input) {
		return this._validate({userAccount:input.account, userPassword: input.password});
	},
	validateCreateClass: function(input) {
		return this._validate({className: input.name});
	},
	validateCreateGroup: function(input) {
		return this._validate({groupName: input.name});
	},
	validatePost: function(input) {
		return this._validate({postTitle: input.title, postContent: input.content});
	},
	validateComment: function(input) {
		return this._validate({commentContent: input.content});
	},
};
module.exports = validator;