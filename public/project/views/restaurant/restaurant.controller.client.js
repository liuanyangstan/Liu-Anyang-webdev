/**
 * Created by stan on 8/11/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .controller("RestaurantController", RestaurantController);

    function RestaurantController(SearchService, $location, $rootScope, $sce, $routeParams) {
        var viewModel = this;
        viewModel.currentUser = $rootScope.currentUser;
        viewModel.location = $routeParams.location;

        viewModel.checkSafeUrl4 = checkSafeUrl4;

        function checkSafeUrl4() {
            // console.log(viewModel.location);

            return SearchService.nearbySearch(viewModel.location);

        }
    }

})();