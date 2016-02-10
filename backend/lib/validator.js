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
		className: {
			errorMessage: '班级名字长度为2-20个字符',
			emptyMessage: '班级名字为空',
			pattern: /^.{2,20}$/
		},
		groupName: {
			errorMessage: '小组名字长度为2-20个字符',
			emptyMessage: '小组名字为空',
			pattern: /^.{2,20}$/
		},
		assignmentName: {
			errorMessage: '班级作业名字长度为2-30个字符',
			emptyMessage: '班级作业名字为空',
			pattern: /^.{2,30}$/
		},
		assignmentLink: {
			errorMessage: '班级作业链接长度为2-250个字符',
			emptyMessage: '班级作业链接为空',
			pattern: /^.{2,250}$/
		},
		assignmentEnd: {
			errorMessage: '班级作业的结束提交时间戳长度为13个数字',
			emptyMessage: '班级作业的结束提交时间戳为空',
			pattern: /^[0-9]{13}$/
		},
		assignmentFrom: {
			errorMessage: '班级作业的开始提交时间戳长度为13个数字',
			emptyMessage: '班级作业的开始提交时间戳为空',
			pattern: /^[0-9]{13}$/
		},
		homeworkMessage: {
			errorMessage: '提交作业的附言长度为2-250个字符',
			emptyMessage: '',
			pattern: /^.{2,250}$/m
		},
		homeworkGithub: {
			errorMessage: '提交作业的github链接长度为2-250个字符',
			emptyMessage: '',
			pattern: /^.{2,250}$/
		},
		reviewMessage: {
			errorMessage: '评审的内容长度为50-500个字符',
			emptyMessage: '评审内容为空',
			pattern: /^.{50,500}$/m
		},
		reviewScore:{
			errorMessage: '评审的分数为0-100',
			emptyMessage: '评审分数为空',
			pattern: /(^100$)|^([1-9]{0,1}[0-9]{1}$)/
		},
		oldPassword: {
			errorMessage: '原密码6~18位英文字母、数字',
			emptyMessage: '原密码为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		},
		newPassword: {
			errorMessage: '新密码6~18位英文字母、数字',
			emptyMessage: '新密码为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		}
	},
	_validate: function(mapper) {
		var result = [];
		for (var key in mapper) {
			if (mapper[key]) {
				if(!this.beChecked[key].pattern.test(mapper[key]))
					result.push(this.beChecked[key].errorMessage);
			} else {
				if (this.beChecked[key].emptyMessage)
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
	validateCreateAssignment: function(input) {
		return this._validate({assignmentName: input.name, assignmentLink: input.link, assignmentFrom: input.from, assignmentEnd: input.end})
	},
	validateUpdateAssignment: function(input) {
		return this.validateCreateAssignment(input);
	},
	validateCreateHomework: function(input) {
		return this._validate({homeworkMessage: input.message, homeworkGithub: input.github});
	},
	validateUpdateHomework: function(input) {
		return this.validateCreateHomework(input);
	},
	validateCreateReview: function(input) {
		return this._validate({reviewMessage: input.message, reviewScore: input.score});
	},
	validateUpdateReview: function(input) {
		return this.validateCreateReview(input);
	},
	validateChangePassword: function(input) {
		return this._validate({oldPassword: input.oldPassword, newPassword: input.newPassword})
	},
};
module.exports = validator;