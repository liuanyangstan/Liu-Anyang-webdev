/**
 * Created by stan on 6/16/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        // vm.editWebsite = editWebsite;
        
        function init () {
            WebsiteService
                .findWebsitesByUser(vm.uid)
                .then(function (website) {
                    vm.website = website;
                });

        }

        init();
        
        // function editWebsite(wid) {
        //     vm.websiteId = wid;
        //     $location.url("/website/" + wid);
        // }

    }

    function NewWebsiteController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;

        //event handlers
        vm.createWebsite = createWebsite;

        function init () {
            WebsiteService
                .findWebsitesByUser(vm.uid)
                .then(function (websites) {
                    vm.websites = websites;
                });
        }
        init();

        //implementation
        function createWebsite(name, desc) {
            if(!(name)) {
                vm.error = "Not a valid website name"
            } else {
                var newWebsite = {
                    name: name,
                    desc: desc
                };
                WebsiteService
                    .createWebsite(vm.uid, newWebsite)
                    .then(
                        function (response) {
                            $location.url("/user/" + vm.uid + "/website");
                        },
                        function (error) {
                            vm.error = "Unable to create";
                        }
                    );
            }
        }

    }

    function EditWebsiteController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        //event handlers
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init () {
            WebsiteService
                .findWebsitesByUser(vm.uid)
                .then(function (websites) {
                    vm.websites = websites;
                });
        }
        init();

        WebsiteService
            .findWebsiteById(vm.wid)
            .then(function (website) {
                vm.website = website;
            });


        //implementation
        function updateWebsite(website) {
            if(!website || !website.name) {
                vm.error = "Website name is required!";
            } else {
                WebsiteService
                    .updateWebsite(vm.wid, website)
                    .then(
                        function (response) {
                            $location.url('/user/' + vm.uid + '/website');
                        },
                        function (error) {
                            vm.error = "Cannot update the website!";
                        }
                    );
            }

        }

        function deleteWebsite(websiteId) {
            WebsiteService
                .deleteWebsite(websiteId)
                .then(
                    function (response) {
                        $location.url('/user/' + vm.uid + '/website');
                    },
                    function (error) {
                        vm.error = "Unable to delete!";
                    }
                );
        }
    }

})();