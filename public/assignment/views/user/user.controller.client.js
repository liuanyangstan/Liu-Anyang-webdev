/**
 * Created by stan on 6/16/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            UserService
                // .findUserByCredentials(username, password)
                .login(username, password)
                .then(
                    function (user) {
                        $location.url('/profile');
                    },
                    function (error) {
                        vm.error = "Username does not exist";
                    }
                )
        }
    }

    function RegisterController($location, $timeout,UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, vpassword) {
            if (username === undefined || username === null || username === ""
                || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }

            UserService
                .findUserByUsername(username)
                .then(
                    function (user) {
                        if (user != null) {
                            vm.error = "Username already exist.";
                            $timeout(function () {
                                vm.error = null;
                            }, 3000);
                            return;
                        } else {
                            var user = {
                                username: username,
                                password: password,
                                firstName: "",
                                lastName: "",
                                email: ""
                            };
                            return UserService
                                .register(user);
                        }
                    }
                )
                .then(
                    function () {
                        $location.url("/profile");
                    }
                )
        }
    }

    function ProfileController($routeParams, $location, $timeout, UserService, loggedin) {
        var vm = this;
        // vm.userId = $routeParams.uid;
        vm.userId = $routeParams._id;
        vm.user = loggedin;

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        // UserService
        //     .findUserById($routeParams.uid)
        //     .then(renderUser, userError);

        function updateUser(user) {
            UserService
                .updateUser(user._id, user)
                .then(function () {
                    vm.message = "Profile changes saved!";
                    $timeout(function () {
                        vm.updated =null;
                    }, 3000);
                });
        }

        function userError (error) {
            vm.error = "User not found";
        }

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(function () {
                    $location.url('/login');
                }, function () {
                    vm.error = "Unable to remove this user.";
                    $timeout(function () {
                        vm.error = null;
                    }, 3000);
                })
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/login');
                })
        }        
        
    }
})();