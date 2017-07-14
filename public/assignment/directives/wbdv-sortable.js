/**
 * Created by stan on 7/13/17.
 */
(function () {
    angular.module('WebAppMaker').directive('sortable', elementSortable);

    // function sortable() {
    //     function linker(scope, element, attributes) {
    //         var start = -1;
    //         var end = -1;
    //         element
    //             .sortable({
    //                 start: function (event, ui) {
    //                     start = $(ui.item).index();
    //                 },
    //                 stop: function (event, ui) {
    //                     end = $(ui.item).index();
    //                     scope.sortableController.sort(start, end);
    //                 }
    //             });
    //     }
    //
    //     return {
    //         scope: {},
    //         link: linker,
    //         controller: sortableController,
    //         controllerAs: 'sortableController'
    //     }
    // }
    //
    // function sortableController() {
    //     var vm = this;
    //     vm.sort = sort;
    //
    //     function sort(start, end) {
    //         console.log([start, end]);
    //     }
    // }


    function elementSortable(){
        function linkFunction(scope, element) {
            const pageId = scope.pageId;
            $(element).sortable({
                    update: function(event, ui){
                        const elemOrder = [];
                        const widgetsElem = $('.widget').toArray();
                        widgetsElem.forEach(function(item){
                            elemOrder.push(item.id);
                        });

                        $.post(
                            '/api/assignment/page/' + pageId + '/widget/order',
                            {elems: elemOrder}
                        );
                    }
                }
            );
        }

        return {
            scope: {
                pageId: '=pid'
            },
            link: linkFunction
        }
    }

})();