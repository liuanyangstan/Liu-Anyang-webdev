/**
 * Created by stan on 7/24/17.
 */

module.exports = function (mongoose, pageModel) {
    var widgetSchema = require('./widget.schema.server')(mongoose);
    var widgetModel = mongoose.model('widgetModel', widgetSchema);

    var api = {
        'createWidget' : createWidget,
        'findAllWidgetsForPage' : findAllWidgetsForPage,
        'findWidgetById' : findWidgetById,
        'updateWidget' : updateWidget,
        'deleteWidget' : deleteWidget,
        'reorderWidget' : reorderWidget
    };

    return api;

    function createWidget(pageId, widget) {
        if (widget.rows === undefined) {
            widget.rows = -1;
        }
        if (widget.size === undefined) {
            widget.size = -1;
        }
        widget._page = pageId;

        return widgetModel
            .create(widget)
            .then(
                function (widget) {
                    return pageModel
                        .addWidgetToPage(pageId, widget._id);
                });

    }
    
    function findAllWidgetsForPage(pageId) {

        //find widgets in page.widgets.
        return pageModel
            .findPageById(pageId)
            .populate('widgets')
            .then(
                function (page) {
                    console.log(page.widgets);
                    return page.widgets;
                }
            )

    }

    function findWidgetById(widgetId) {
        return widgetModel.findOne({_id: widgetId});
    }
    
    function updateWidget(widgetId, widget) {
        if (widget.rows === undefined) {
            widget.rows = -1;
        }
        if (widget.size === undefined) {
            widget.size = -1;
        }
        // console.log(typeof widget.size);

        return widgetModel.update({
            _id : widgetId
        }, {
            name: widget.name,
            text: widget.text,
            placeholder: widget.placeholder,
            description: widget.description,
            url: widget.url,
            width: widget.width,
            size: widget.size,
            rows: widget.rows,
            formatted: widget.formatted
        });
    }

    function deleteWidget(pageId, widgetId) {

        return widgetModel
            .remove({_id: widgetId})
            .then(function (status) {
                return pageModel
                    .removeWidgetFromPage(pageId, widgetId);
            })

    }
    
    function reorderWidget(pageId, start, end) {
        return pageModel
            .findPageById(pageId)
            .then(
                function (page) {
                    if(start && end) {

                        if(end >= page.widgets.length) {

                            var k = end - page.widgets.length;
                            while((k--) + 1) {
                                page.widgets.push(undefined);
                            }
                        }
                        page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);

                        return page.save();
                    }
                }
            )
    }
};