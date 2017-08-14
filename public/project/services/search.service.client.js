/**
 * Created by stan on 8/11/17.
 */
(function () {
    angular
        .module("FoodFinderApp")
        .factory('SearchService', SearchService);
    
    function SearchService($http, $sce, $rootScope) {

        var api = {
            search: search,
            nearbySearch: nearbySearch
        };

        return api;

        function search(title) {

            var address = title.address;

            var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ address +"&key="+
                "AIzaSyDioOFTaKWDOP32YomUDePsvga4CF6RDSI";

            return $http.get(url)
                .then(function successCallback(response) {
                    // console.log("receive response", response);
                    return response;
                },function errorCallback(response) {
                    console.log("failed" + response);
                });

        }

        function nearbySearch(title) {

            var url = "https://www.google.com/maps/embed/v1/search?key=AIzaSyD6TfeGbq0OZX86s45odgvXuaqhouSO8I0&q=" +
                "restaurant&center="+ title +"&zoom=15";
            // var url = "https://www.google.com/maps/embed/v1/search?key=AIzaSyDioOFTaKWDOP32YomUDePsvga4CF6RDSI&q=record+stores+in+Seattle";

            return $sce.trustAsResourceUrl(url);
        }

    }

})();