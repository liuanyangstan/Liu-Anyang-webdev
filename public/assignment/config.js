/**
 * Created by stan on 6/16/17.
 */
(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : "views/user/login.view.client.html",
                 controller: "LoginController",
                 controllerAs: "model"
            })
            .when('/register', {
                templateUrl : "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/profile', {
                templateUrl : "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/login', {
                templateUrl : "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            // .when('/user/:uid', {
            //     templateUrl : "views/user/profile.view.client.html",
            //     controller: "ProfileController",
            //     controllerAs: "model"
            // })
            .when('/website', {
                templateUrl : "views/website/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/new', {
                templateUrl : "views/website/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid', {
                templateUrl : "views/website/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page', {
                templateUrl : "views/page/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/new', {
                templateUrl : "views/page/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid', {
                templateUrl : "views/page/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget', {
                templateUrl : "views/widget/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/new', {
                templateUrl : "views/widget/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/create/:wtype', {
                templateUrl : "views/widget/widget-new.view.client.html",
                controller: "CreateWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/:wgid', {
                templateUrl : "views/widget/editors/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/:wgid/search' ,{
                templateUrl : "views/widget/widget-flicker-search.view.client.html",
                controller: "flickrController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .otherwise({
                redirectTo : "/"
            });
    }

    //security
    var checkLoggedin = function ($q, $timeout, $http, $location) {
        var deferred = $q.defer();
        $http
            .get('/api/loggedin')
            .then(
                function (response) {
                    var user = response.data;
                    if(user !== '0') {
                        deferred.resolve(user);
                    } else {
                        deferred.reject();
                        $location.url('/login');
                    }
                });
        return deferred.promise;
    };

    var checkCurrentUser = function ($q, $timeout, $http, $location) {
        var deferred = $q.defer();
        $http
            .get('/api/loggedin')
            .then(function (response) {
                var user = response.data;
                if(user === '0') {
                    user = null;
                }
                deferred.resolve(user);
            });
        return deferred.promise;
    };

})();