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
                .findUserByCredentials(username, password)
                .then(function (found) {
                    if (found !== null) {
                        $location.url("/user/" + found._id);
                    } else {
                        vm.error = "Username does not exist.";
                    }
                }, function (error) {
                    vm.error = "Not a valid username or password.";
                });
        }
    }

    function RegisterController($location, $timeout,UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, vpassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
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
                    function () {
                        vm.error = "sorry, that username is taken";
                    },
                    function () {
                        var newUser = {
                            username: username,
                            password: password
                        };
                        UserService
                            .createUser(newUser)
                            .then(function (user) {
                                $location.url("/user/" + user._id);
                            });
                    }
                );
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        UserService
            .findUserById($routeParams.uid)
            .then(renderUser, userError);

        function updateUser(user) {
            UserService
                .updateUser(vm.userId, user)
                .then(function () {
                    vm.message = "User update was successful";
                })
        }
        
        function renderUser (user) {
            console.log(user);
            vm.user = user;
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
                    vm.error = "Unable to unregister you";
                })
        }

    }
})();