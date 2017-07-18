/**
 * Created by stan on 7/17/17.
 */
(function () {
    angular
        .module('WebAppMaker')
        .controller('flickrController', flickrController);

    function flickrController($routeParams, $location, WidgetService, flickrService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        
        function searchPhotos(searchTerm) {
            // console.log(searchTerm);
            flickrService
                .searchPhotos(searchTerm)
                .then(function (response) {
                    // console.log(response.data);
                    data = response.data.replace("jsonFlickrApi(", "");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }
        
        function selectPhoto(photo) {
            // console.log(photo);
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server +
                "/" + photo.id + "_" + photo.secret + "_b.jpg";

            widget = {
                _id: vm.wgid,
                widgetType: "IMAGE",
                pageId: vm.pid,
                width: "100%",
                url: url
            };

            WidgetService
                .updateWidget(vm.wgid, widget)
                .then(function (response) {
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + vm.wgid);
                }
                ,function (err) {
                        vm.error = err.data;
                    })

        }
    }
})();