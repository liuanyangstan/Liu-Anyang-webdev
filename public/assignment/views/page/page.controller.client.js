/**
 * Created by stan on 6/16/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService, loggedin) {
        var vm = this;
        // vm.uid = $routeParams.uid;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;
        
        
        function init() {
            // WebsiteService
            //     .findWebsitesByUser(vm.uid)
            //     .then(function (website) {
            //         vm.website = website;
            //     });

            PageService
                .findPageByWebsiteId(vm.wid)
                .then(function (pages) {
                    vm.pages = pages;
                })
            
        }

        init();
    }

    function NewPageController($routeParams, PageService, $location, loggedin) {
        var vm = this;
        // vm.uid = $routeParams.uid;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;

        //event handlers
        vm.createPage = createPage;

        function init() {
            // WebsiteService
            //     .findWebsitesByUser(vm.uid)
            //     .then(function (website) {
            //         vm.website = website;
            //     });

            PageService
                .findPageByWebsiteId(vm.wid)
                .then(function (pages) {
                    vm.pages = pages;
                })

        }

        init();

        //implementation
        function createPage(name, description) {
            if(!(name)) {
                vm.error = "Not a valid page name"
            } else {
                var newPage = {
                    name: name,
                    description: description
                };
                PageService
                    .createPage(vm.wid, newPage)
                    .then(
                        function (response) {
                            $location.url('/website/' + vm.wid + '/page');
                        },
                        function (error) {
                            vm.error = "Failed to create";
                        }
                    );
            }
        }

    }

    function EditPageController($routeParams, WebsiteService, PageService, $location, loggedin) {
        var vm = this;
        // vm.uid = $routeParams.uid;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        //event handlers
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        WebsiteService
            .findWebsitesByUser(vm.uid)
            .then(function (website) {
                vm.website = website;
            });

        PageService
            .findPageById(vm.pid)
            .then(function (page) {
                vm.page = page;
            });
        
        //implementation
        function updatePage(page) {
            if(!page || !page.name) {
                vm.error = "Page name is required!";
            } else {
                PageService
                    .updatePage(vm.pid, page)
                    .then(
                        function (response) {
                            $location.url('/website/' + vm.wid + '/page');
                        },
                        function (error) {
                            vm.error = "Cannot update the page!";
                        }
                    );
            }
        }

        function deletePage(pageId) {

            PageService
                .deletePage(vm.wid, pageId)
                .then(
                    function (response) {
                        $location.url('/website/' + vm.wid + '/page');
                    },
                    function (error) {
                        vm.error = "Unable to delete!";
                    }
                );
        }
    }

})();