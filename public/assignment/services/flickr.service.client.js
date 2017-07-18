/**
 * Created by stan on 6/16/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .service('flickrService', flickrService);

    function flickrService($http) {

        this.searchPhotos = searchPhotos;

        var key = "3d9661ff4634ae94149bb022ec5a219e";
        var secret = "def9972242af9b31";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        function searchPhotos(searchTerm) {
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();