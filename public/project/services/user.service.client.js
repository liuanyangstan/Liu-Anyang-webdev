/**
 * Created by stan on 8/9/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .factory('UserService', UserService);
    
    function UserService($http) {

        var services = {
            "logout": logout,
            "login" : login,
            "register": register,
            "findUserByCredentials" : findUserByCredentials,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "findUserByUsername": findUserByUsername,
            "createUser": createUser,
            "deleteUser": deleteUser,
            "findAllUsers":findAllUsers,
            "findFriendByUsername":findFriendByUsername,
            "followUser":followUser,
            "unfollowUser":unfollowUser,
            "getAllUsersByIds":getAllUsersByIds
        };
        return services;


        function logout(user) {
            return $http.post("/rest/logout");
        }

        function login(user) {
            return $http.post("/rest/login", user);
        }

        function register(user) {
            return $http.post("/rest/register", user);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/rest/user?username="+username+"&password="+password);
        }

        function findUserById(userId) {
            return $http.get("/rest/user/"+userId);
        }

        function updateUser(userId, newUser) {
            return $http.put("/rest/user/"+userId, newUser);
        }

        function findUserByUsername(username) {
            return $http.get("/rest/user?username="+username);
        }

        function createUser(newUser) {
            return $http.post("/rest/user", newUser);
        }

        function deleteUser(userId) {
            return $http.delete("/rest/user/"+userId);
        }
        function findAllUsers() {
            return $http.get("/rest/user/getall");
        }

        function findFriendByUsername(username) {
            return $http.get("/rest/user/findfriends/"+username);
        }

        function followUser(mainPersonID,followerID) {
            return $http.post("/rest/following/"+mainPersonID+"/follower/"+followerID);
        }

        function unfollowUser(mainPersonID,followerID) {
            return $http.post("/rest/unfollow/"+mainPersonID+"/unfollower/"+followerID);
        }

        function getAllUsersByIds(userIds) {
            return $http.post("/get/users/ids",userIds);
        }
    }
})();