angular.module('userApp', ['ngFileUpload'])
	.controller('userController', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
		var App = this;
		App.users = [];
		App.selectedUser = {};
		App.showMessage = false;

		App.getUsers = function () {
			$http.get('/user')
				.success(function (users) {
					App.users = users;
				})
		};

		App.viewUser = function (user) {
			App.selectedUser = {};
			angular.extend(App.selectedUser, user);
		};


		App.createUser = function () {
			if ($scope.form.$valid && App.selectedUser.password == App.selectedUser.confirmPassword) {
				delete App.selectedUser.id;

				$http.post('/user', App.selectedUser)
					.success(function (editedUser) {
						App.alert('user created successfuly!', 'success');
						App.selectedUser = {};
						App.getUsers();
					})
					.error(function (err) {
						App.alert('Error:' + err.message, 'danger');
						console.log(err);
					});
			} else {
				App.alert('Error: You must complete the form properly before sending the information', 'danger');
			}

		};

		App.uploadAvatar = function (file) {
			if (file) {
				Upload.upload({
					url: '/uploadfile',
					data: { file: file }
				}).then(function (resp) {
					App.selectedUser.avatar = resp.config.data.file.name;
					//console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				}, function (resp) {
					//console.log('Error status: ' + resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			}
		};

		App.updateUser = function (user) {
			if ($scope.form.$valid && App.selectedUser.password == App.selectedUser.confirmPassword) {
				$http.post('/user/' + user.id, App.selectedUser)
					.success(function (editedUser) {
						App.alert('user updated successfuly!', 'success');
						App.getUsers();
					})
					.error(function (err) {
						App.alert('Error:' + err.message, 'danger');
						console.log(err);
					});
			} else {
				App.alert('Error: You must complete the form properly before sending the information', 'danger');
			}
		};

		App.deleteUser = function (user) {
			$http.delete('/user/' + user.id)
				.success(function (editedUser) {
					App.getUsers();
				})
				.error(function (err) {
					App.alert('Error:' + err.message, 'danger');
					console.log(err);
				});
		};

		App.alert = function (message, severity) {
			App.showMessage = true;
			App.message = message;
			App.severity = severity;
			setTimeout(function () {
				$scope.$apply(function () {
					App.showMessage = false;
					App.message = "";
					App.severity = "";
				});
			}, 4000);
		};

		App.editUser = function (user) {

		};

		App.getUsers();
	}]);