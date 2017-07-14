/**
 * Created by stan on 7/13/17.
 */
(function () {
        angular
            .module("wamDirectives", [])
            .directive("wamSortable", wamSortable);
        // wam-sortable

        function wamSortable() {
            console.log("Hello from sortable");
        }
    }
    
)();