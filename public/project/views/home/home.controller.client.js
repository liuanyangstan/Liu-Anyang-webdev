/**
 * Created by stan on 8/8/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .controller("HomeController", HomeController);

    function HomeController($location, $rootScope, $scope, SearchService) {
        var viewModel = this;
        viewModel.currentUser = $rootScope.currentUser;

        viewModel.search = search;

        function init() {
        }
        init();

        function search(place) {
            SearchService.search(place)
                .then(function (response) {

                    var address = response.data.results[0].geometry.location;

                    var lat = address.lat;
                    var lng = address.lng;
                    var location = lat + "," + lng;

                    // console.log(location);

                    $location.url("/restaurant?location=" + location);
                })
        }

    }

})();