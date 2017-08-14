/**
 * Created by stan on 8/8/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .config(configuration);
    
    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/home.view.client.html",
                controller: 'HomeController',
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin}
            })
            .when("/restaurant", {
                templateUrl: "views/restaurant/restaurant.view.client.html",
                controller: 'RestaurantController',
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin}
            })
            .when("/login",{
                templateUrl: 'views/user/login.view.client.html',
                controller: 'LoginController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin}
            })
            .when("/logout",{
                templateUrl: 'views/home/home.view.client.html',
                controller: 'LogoutController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin}
            })
            .when("/register",{
                templateUrl: 'views/user/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when("/user",{
                templateUrl: 'views/user/dashboard/user-dashboard.view.client.html',
                controller: 'UserDashboardController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin}
            })
            .when("/profile",{
                templateUrl: 'views/user/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .otherwise({
               redirectTo: "/home"
            });

    }

})();

    //security
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

        var deferred = $q.defer();

        $http.get('/rest/loggedin')
            .then(
                function(user) {
                    $rootScope.errorMessage = null;
                    if (user.data && user.data.length != 0 && user.data !== '0') {
                        user = user.data;
                        $rootScope.currentUser = user[0];
                        deferred.resolve();
                    } else {
                        $rootScope.currentUser = null;
                        deferred.resolve();
                    }
                }
            );

        return deferred.promise;
    };
