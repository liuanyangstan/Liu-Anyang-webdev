/**
 * Created by stan on 7/13/17.
 */
(function () {
    angular.module('WebAppMaker').directive('sortable', sortable);

    function sortable($http) {
        function linker(scope, element, attributes) {
            var fullUrl = window.location.href;
            var fullUrlParts = fullUrl.split("/");
            var pageId = fullUrlParts[fullUrlParts.indexOf("page")+1];
            // const pageId = scope.pageId;

            var start = -1;
            var end = -1;
            $(element).sortable({
                    start: function (event, ui) {
                        start = $(ui.item).index();
                        console.log("start: " + start);
                    },
                    stop: function (event, ui) {
                        end = $(ui.item).index();
                        scope.callback = {
                            start: start,
                            end: end
                        };
                        console.log("end: " + end);

                        var url = '/api/page/' + pageId + '/widget?start=' + start + '&end=' + end;
                        $http.put(url);
                        // scope.sortableController.sort(start, end);
                    }
                });
        }

        return {
            link: linker,
            callback: '&'
            // controller: sortableController,
            // controllerAs: 'sortableController'
        }
    }

    // function sortableController() {
    //     var vm = this;
    //     vm.sort = sort;
    //
    //     function sort(start, end) {
    //         console.log([start, end]);
    //     }
    // }


    // function elementSortable(){
    //     function linkFunction(scope, element) {
    //         const pageId = scope.pageId;
    //         $(element).sortable({
    //                 update: function(event, ui){
    //                     const elemOrder = [];
    //                     const widgetsElem = $('.widget').toArray();
    //                     widgetsElem.forEach(function(item){
    //                         elemOrder.push(item.id);
    //                     });
    //
    //                     $.post(
    //                         '/api/page/' + pageId + '/widget/order',
    //                         {elems: elemOrder}
    //                     );
    //                 }
    //             }
    //         );
    //     }
    //
    //     return {
    //         scope: {
    //             pageId: '=pid'
    //         },
    //         link: linkFunction
    //     }
    // }

})();