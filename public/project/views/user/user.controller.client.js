/**
 * Created by stan on 8/10/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .controller("LoginController", LoginController)
        .controller("LogoutController", LogoutController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("UserDashboardController", UserDashboardController);


    function LoginController(UserService, $location, $rootScope) {
        var viewModel = this;
        viewModel.currentUser = $rootScope.currentUser;

        viewModel.login = login;
        
        function login(user) {
            if(!user || !user.username || !user.password) {
                viewModel.errorMessage = "Username and/or Password cannot be empty!";
            } else {
                UserService
                    .login(user)
                    .then(
                        function (response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url('/user');
                        },
                        function (response) {
                            viewModel.errorMessage = "Invalid enter!";
                        }
                    );
            }
        }
    }
    
    function LogoutController(UserService, $location, $rootScope) {
        var viewModel = this;

        viewModel.logout = logout;
        
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url('/');
                    });
        }
        logout();
    }


    function RegisterController(UserService, $location, $rootScope) {
        var viewModel = this;
        viewModel.currentUser = $rootScope.currentUser;

        viewModel.register = register;
        
        function register(user) {

            if(user.isAdmin === null || user.isAdmin === undefined) {
                user.isAdmin = false;
            }

            if(user && user.username && user.password && user.retypepassword
                && user.email && user.lastName && user.firstName){
                if(user.retypepassword === user.password) {
                    UserService
                        .register(user)
                        .then(
                            function (response) {
                                if(response.data != null) {
                                    var user = response.data;
                                    $rootScope.currentUser = user;
                                    $location.url('/user');
                                } else {
                                    viewModel.errorMessage = "Username exists!";
                                }
                            });
                } else {
                    viewModel.errorMessage = "Typo";
                }
            }
        }
    }


    function ProfileController(UserService, $rootScope, $location) {
        var viewModel = this;

        viewModel.currentUser = $rootScope.currentUser;
        var userId = viewModel.currentUser._id;
        viewModel.userId = userId;

        viewModel.updateUser = updateUser;
        viewModel.deleteUser = deleteUser;

        function init() {
            var promise = UserService.findUserById(userId);
            promise.then(
                function (user) {
                    user = user.data;
                    if(user != undefined) {
                        user.retypepassword = user.password;
                        viewModel.user = user;
                    } else {
                        viewModel.errorMessage = "Error occurred while loading user:" + userId;
                    }
                }
            );
        }
        init();

        function updateUser(user) {
            if(user && user.username && user.password && user.retypepassword
                && user.email && user.lastName && user.firstName){

                if(user.retypepassword === user.password) {
                    var promise = UserService.updateUser(userId, user);
                    promise.then(
                        function successCallback(response) {
                            if (response.status == 200) {
                                $rootScope.currentUser = user;
                                viewModel.successMessage = "Profile changes saved!!!";
                                viewModel.errorMessage = undefined;
                            } else {
                                viewModel.errorMessage = "Error";
                            }
                        },
                        function errorCallback(response) {
                            viewModel.errorMessage = "Error occurred while updating user:" + userId;
                        });

                } else{

                    viewModel.errorMessage = "Password and verify-password doesn't match!!!";
                }

            } else {
                    viewModel.errorMessage = "All the fields are mandatory";
            }
        }

        function deleteUser(user) {
            var promise = UserService.deleteUser(user._id);
            promise.then(
                function successCallback(response) {
                    if(response.status == 200) {
                        $location.url('/login');
                    } else {
                        viewModel.errorMessage = "Error occurred while updating user:" + userId;
                    }
                },
                function errorCallback(response) {
                    viewModel.errorMessage = "Error occurred while updating user:" + userId;
                });
        }

    }


    function UserDashboardController(UserService, $route, $location, $routeParams, $rootScope) {

        var viewModel = this;
        viewModel.currentUser = $rootScope.currentUser;

        var userId = viewModel.currentUser._id;
        var user = null;

        viewModel.findFriendByUsername = findFriendByUsername;


        function init() {
            var promise = UserService.findUserById(userId);
            promise.then(
                function (user) {
                    user = user.data;
                    if(user!= undefined) {
                        viewModel.user = user;

                    } else {
                        viewModel.errorMessage = "Error while loading user by ID:" + userId;
                    }
                }
            );
        }
        init();

        function findFriendByUsername(friendUsername) {
            friendUsername = friendUsername.username;

            if(friendUsername){
                var promise = UserService.findFriendByUsername(friendUsername);
                promise.then(
                    function (friends) {
                        friends = friends.data;
                        if(friends!= undefined) {
                            viewModel.friends = friends;
                        } else {
                            viewModel.errorMessageFriends = "Sorry, No results matching the Username:" + friendUsername;
                        }
                    }
                );
            }
            else{
                viewModel.errorMessageFriends = "Please search by Username";
            }
        }

    }

})();