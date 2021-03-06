(function() {
    'use strict';

    angular
        .module('app')
        .controller('userController', Controller);

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage) {
        $scope.users = [];
        $scope.curentUserId = localStorage.getItem('curentUserId')
        $scope.chats = [];
        if ($rootScope.userLogin) {
            if($state.current.name == "home") {
                $rootScope.Title = "User Profile";
                userService.GetAll().then(function(res) {
                    $scope.users = res.data;
                }).catch(function(err) {
                    console.log(err);
                });
                $scope.openChat = function(user) {
                    $scope.chats.push(user)
                    
                    if($scope.chats.length > 3) {
                        $scope.chats.shift()
                        console.log($scope.chats,'chaaaaaaat');
                    }
                    const curentId = localStorage.getItem("curentUserId");
                    
                    const chatInfo = {
                        curentId: curentId,
                        friendId: user._id
                    }
                    userService.GetChatById(chatInfo).then(function(res) {
                        console.log(res,"res chat");
                    })
                }
                $scope.sendMessage = function(message) {
                    console.log(message);
                }
            }
            if ($state.current.name == "users" ) {
                $rootScope.Title = "User Listing";
                userService.GetAll().then(function(res) {
                    $scope.users = res.data;
                }).catch(function(err) {
                    console.log(err);
                });
                $scope.deleteUser = function(id) {
                    if (confirm('Are you sure to delete?')) {
                        userService.Delete(id).then(function(res) {
                            if (res.success) {
                                successMessage(res.message);
                                $state.go("users", {}, { reload: true });
                            }else  errorMessage(res.message)
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                };
            } else if ($state.current.name == "edit") {
                $rootScope.Title = "Edit User";
                var id = $stateParams.id;
                userService.GetById(id).then(function(res) {
                    $scope.user = res.data;
                }).catch(function(err) {
                    console.log(err);
                });
                $scope.saveData = function(user) {
                    if ($scope.userForm.$valid) {
                        userService.Update(user).then(function(res) {
                            if (res.success) {
                               successMessage(res.message);
                                $state.go("users");
                            }else  errorMessage(res.message)
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                };
            } else if ($state.current.name == "create") {
                $rootScope.Title = "Create User";
                $scope.saveData = function(user) {
                    $scope.IsSubmit = true;
                    console.log("create",$scope.userForm);
                    if ($scope.userForm.$valid) {
                        userService.Create(user).then(function(res) {
                            if (res.success) {
                                successMessage(res.message);
                                $state.go("users");
                            }else  errorMessage(res.message)
                        }).catch(function(err) {
                            console.log(err);
                            errorMessage(err)
                        });
                    }
                };
            }
        } else $state.go("login");

        function successMessage(message) {
            $(".success").removeClass("in").show();
            $(".success").delay(200).addClass("in").fadeOut(3000);
            $rootScope.message = message;
        }
        function errorMessage(message){
            $(".error").removeClass("in").show();
            $(".error").delay(200).addClass("in").fadeOut(3000);
            $rootScope.message = message;
        }
    }
})();