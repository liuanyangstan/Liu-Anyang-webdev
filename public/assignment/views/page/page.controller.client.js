/**
 * Created by stan on 6/16/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
    }

    function NewPageController($routeParams, WebsiteService, PageService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        //event handlers
        vm.createPage = createPage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.wid);
        }
        init();

        //implementation
        function createPage(page) {
            PageService.createPage(vm.wid, page);
            $location.url('/user/' + vm.uid + '/website/' + vm.wid + '/page');
        }
    }

    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        //event handlers
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.wid);
            vm.page = PageService.findPageById(vm.pid);
        }
        init();

        //implementation
        function updatePage(page) {
            PageService.updatePage(vm.pid, page);
            $location.url('/user/' + vm.uid + '/website/' + vm.wid + '/page');
        }

        function deletePage(pageId) {
            PageService.deletePage(pageId);
            $location.url('/user/' + vm.uid + '/website/' + vm.wid + '/page');
        }
    }

})();