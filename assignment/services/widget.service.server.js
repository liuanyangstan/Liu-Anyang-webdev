/**
 * Created by stan on 6/30/17.
 */
module.exports = function(app){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    //POST Calls.
    app.post('/api/page/:pageId/widget', createWidget);
    app.post ('/api/upload', upload.single('myFile'), uploadImage);

    //GET Calls.
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);

    //PUT Calls.
    app.put('/api/widget/:widgetId', updateWidget);

    //DELETE Calls.
    app.delete('/api/widget/:widgetId', deleteWidget);

    //Sort
    app.put('/api/page/:pageId/widget', sortWidget);
    app.post('/api/page/:pageId/widget/order', reOrderWidget);


    function reOrderWidget(req, res) {
        const pageId = req.params['pageId'];
        const newOrder = req.body.elems;
        // console.log(newOrder);
        for(var i in newOrder) {
            for(var j in widgets) {
                if(widgets[j]._id === newOrder[i]) {
                    widgets[j].index = i;
                }
            }
        }
        res.sendStatus(200);
    }
    
    function sortWidget(req, res) {
        var pageId = req.params.pid;
        var pageWidgets = [];
        for(wi in widgets) {
            var widget = widgets[wi];
            if(parseInt(widget.pageId) === parseInt(pageId)) {
                pageWidgets.push(widget);
            }
        }

        var index1 = req.query.start;
        var index2 = req.query.end;

        var start = widgets.indexOf(pageWidgets[index1]);
        var end = widgets.indexOf(pageWidgets[index2]);

        if(index1 && index2) {
            widgets.splice(end, 0, widgets.splice(start, 1)[0]);
            res.sendStatus(200);
            return;
        }
        res.sendStatus(404).send("cannot be reorder");
    }


    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var width = req.body.width;
        var myFile = req.file;

        var originalname = myFile.originalname;   //file name on user's computer
        var filename = myFile.filename;           //new file name in upload folder
        var path = myFile.path;                   //full path of uploaded file
        var destination = myFile.destination;     //folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;

        widget = findWidgetById(widgetId);
        if(!widget) {
             widget = {
                _id: new Date().getTime().toString(),
                widgetType: 'IMAGE',
                pageId: pageId,
                size: size,
                text: '',
                name: '',
                width: width
             };
            widgets.push(widget);
        }

        widget.url = '/uploads/' + filename;

        function findWidgetById(widgetId) {
            var widget = widgets.find(function (wi) {
                return wi._id == widgetId;
            });

            if(widget) {
                return widget;
            }
        }

        var callbackUrl = "/#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/";
        res.redirect(callbackUrl);

    }

    function createWidget(req, res) {
        var pid = req.params.pageId;
        var widget = req.body;

        var newWidget = {
            _id: new Date().getTime().toString(),
            widgetType: widget.widgetType,
            pageId: pid,
            size: widget.size,
            text: widget.text,
            name: widget.name,
            width: widget.width,
            url: widget.url
        };
        widgets.push(newWidget);

        if(newWidget) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pageId;
        var results = [];
        for(wi in widgets) {
            var widget = widgets[wi];
            if (parseInt(widget.pageId) === parseInt(pid)) {
                results.push(widget);
            }
        }
        res.send(results);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        var widget = widgets.find(function (wi) {
            return wi._id == widgetId;
        });

        if(widget) {
            res.send(widget);
        } else {
            res.sendStatus(404);
        }
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = req.params.widgetId;
        for(wi in widgets) {
            var wid = widgets[wi]._id
            console.log('wid', wid, 'eq', wid === widgetId, typeof widgetId, typeof wid);
            if(widgetId === wid) {
                widgets[wi].size = widget.size;
                widgets[wi].text = widget.text;
                widgets[wi].width = widget.width;
                widgets[wi].url = widget.url;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for(wi in widgets) {
            if(parseInt(widgets[wi]._id) === parseInt(widgetId)) {
                widgets.splice(wi, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

};