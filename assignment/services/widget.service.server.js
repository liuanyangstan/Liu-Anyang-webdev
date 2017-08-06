/**
 * Created by stan on 6/30/17.
 */

module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

    var model = models.widgetModel;

    //POST Calls.
    app.post('/api/page/:pageId/widget', createWidget);
    app.post ('/api/upload', upload.single('myFile'), uploadImage);

    //GET Calls.
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);

    //PUT Calls.
    app.put('/api/widget/:widgetId', updateWidget);

    //DELETE Calls.
    app.delete('/api/page/:pageId/widget/:widgetId', deleteWidget);

    //Sort
    app.put('/api/page/:pageId/widget', reorderWidgets);



    function reorderWidgets(req, res) {
        var pageId = req.params.pageId;

        var index1 = req.query.start;
        var index2 = req.query.end;

        model
            .reorderWidget(pageId, index1, index2)
            .then(
                function (page) {
                    res.sendStatus(202);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }


    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var width = req.body.width;
        var myFile = req.file;

        if(myFile === undefined || myFile === null) {
            return;
        }           //If doesn't upload the file, it cannot click the upload button

        var originalname = myFile.originalname;   //file name on user's computer
        var filename = myFile.filename;           //new file name in upload folder
        var path = myFile.path;                   //full path of uploaded file
        var destination = myFile.destination;     //folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;

        var url = '/uploads/' + filename;

        if(widgetId === undefined || widgetId === null || widgetId === '') {
            var widget = {
                // _id: new Date().getTime().toString(),
                widgetType: 'IMAGE',
                // pageId: pageId,
                size: size,
                url: url,
                // text: '',
                // name: '',
                width: width
            };

            model
                .createWidget(pageId, widget)
                .then(
                    function (widget) {
                        if(widget) {
                            res.json(widget);
                        } else {
                            widget = null;
                            res.send(widget);
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                )
        } else {

            model
                .findWidgetById(widgetId)
                .then(
                    function (widget) {
                        widget.url = url;
                        model
                            .updateWidget(widgetId, widget)
                            .then(
                                function (widget) {
                                    res.json(widget);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            )
                    },
                    function (error) {
                        res.sendStatus(400).send("cannot find widget");
                    }
                )
        }

        var callbackUrl = "/#!/website/" + websiteId + "/page/" + pageId + "/widget";
        res.redirect(callbackUrl);
    }


    function createWidget(req, res) {
        var pid = req.params.pageId;
        var widget = req.body;

        model
            .createWidget(pid, widget)
            .then(function (widget) {
               res.json(widget);
            })
            .catch(function (err) {
                res.sendStatus(500);
                console.log('err', err);
            });

    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pageId;

        model
            .findAllWidgetsForPage(pid)
            .then(
                function (widgets) {
                    if(widgets) {
                        res.json(widgets);
                    } else {
                        widgets = null;
                        res.send(widgets);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;

        model
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    if(widget) {
                        res.json(widget);
                    } else {
                        widget = null;
                        res.send(widget);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = req.params.widgetId;

        model
            .updateWidget(widgetId, widget)
            .then(
                function (widget){
                    res.json(widget)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteWidget(req, res) {
        var pageId = req.params.pageId;
        var widgetId = req.params.widgetId;

        if(widgetId){
            model
                .deleteWidget(pageId, widgetId)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }
    }

};