/**
 * Created by stan on 6/16/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory('WidgetService', WidgetService);

    function WidgetService($http) {

        var createWidgetMap = {
            'HEADER': createHeaderWidget,
            'IMAGE': createImageWidget,
            'YOUTUBE': createYouTubeWidget,
            'HTML': createHTMLWidget,
            'LINK': createLinkWidget,
            'TEXTINPUT': createTextInputWidget,
            'LABEL': createLabelWidget,
            'BUTTON': createButtonWidget,
            'REPEATER': createRepeaterWidget,
            'DATATABLE': createDataTableWidget
        };

        var services = {
            'createWidget': createWidget,
            'findWidgetsByPageId': findWidgetsByPageId,
            'findWidgetById': findWidgetById,
            'updateWidget': updateWidget,
            'deleteWidget': deleteWidget
        };
        return services;


        function createHeaderWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'HEADER',
                pageId: pageId,
                size: widget.size,
                name: widget.name,
                text: widget.text
            };
        }

        function createLabelWidget(widgetId, pageId, widget) {
        }

        function createHTMLWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'HTML',
                pageId: pageId,
                name: widget.name,
                text: widget.text
            };
        }

        function createTextInputWidget(widgetId, pageId, widget) {

        }

        function createLinkWidget(widgetId, pageId, widget) {

        }

        function createButtonWidget(widgetId, pageId, widget) {

        }

        function createImageWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'IMAGE',
                pageId: pageId,
                width: widget.width,
                url: widget.url,
                name: widget.name,
                text: widget.text
            };

        }

        function createYouTubeWidget(widgetId, pageId, widget) {
            return {
                _id: widgetId,
                widgetType: 'YOUTUBE',
                pageId: pageId,
                name: widget.name,
                text: widget.text,
                width: widget.width,
                url: widget.url
            };

        }

        function createDataTableWidget(widgetId, pageId, widget) {

        }

        function createRepeaterWidget(widgetId, pageId, widget) {

        }

        /*
         * Standard CRUD
         */

        function createWidget(pageId, widget) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget)
                .then(function (response) {
                    return response.data;
                });
        }

        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteWidget(pageId, widgetId) {
            // var url = "/api/widget/" + widgetId;
            var url = "/api/page/" + pageId + "/widget/" + widgetId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();