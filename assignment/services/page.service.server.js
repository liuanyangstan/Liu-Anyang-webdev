/**
 * Created by stan on 6/30/17.
 */

module.exports = function (app, models) {

    var model = models.pageModel;

    //POST Calls
    app.post('/api/website/:websiteId/page',createPage);

    //GET Calls
    app.get('/api/website/:websiteId/page',findAllPagesForWebsite);
    app.get('/api/page/:pageId',findPageById);

    //PUT Calls
    app.put('/api/page/:pageId',updatePage);

    //DELETE Calls
    app.delete('/api/website/:websiteId/page/:pageId', deletePage);

    /*API calls implementation*/
    function createPage(req, res) {
        var wid = req.params.websiteId;
        var page = req.body;

        model
            .createPage(wid, page)
            .then(function (page) {
                res.json(page);
            });

    }

    function findAllPagesForWebsite(req, res) {
        var wid = req.params.websiteId;

        model
            .findAllPagesForWebsite(wid)
            .then(
                function (pages) {
                    if(pages) {
                        res.json(pages);
                    } else {
                        pages = null;
                        res.send(pages);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )

    }

    function findPageById(req, res) {
        var pid = req.params.pageId;

        model
            .findPageById(pid)
            .then(
                function (page) {
                    if(page) {
                        res.json(page);
                    } else {
                        page = null;
                        res.send(page);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )

    }

    function updatePage(req, res) {
        var page = req.body;
        var pid = req.params.pageId;

        model
            .updatePage(pid, page)
            .then(
                function (page){
                    res.json(page)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );

    }

    function deletePage(req, res) {
        var wid = req.params.websiteId;
        var pid = req.params.pageId;

        if(pid){
            model
                .deletePage(wid, pid)
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