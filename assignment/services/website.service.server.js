/**
 * Created by stan on 6/30/17.
 */

/*var websites = require("./websites.mock.json");*/

module.exports = function(app, models){

    var model = models.websiteModel;

    //POST Calls
    app.post('/api/user/:userId/website',createWebsite);

    //GET Calls
    app.get('/api/user/:userId/website',findAllWebsitesForUser);
    app.get('/api/website/:websiteId',findWebsiteById);

    //PUT Calls
    app.put('/api/website/:websiteId',updateWebsite);

    //DELETE Calls
    app.delete('/api/user/:userId/website/:websiteId', deleteWebsite);


    /*API calls implementation*/
    function createWebsite(req, res) {
        var uid = req.params.userId;
        var website = req.body;

        model
            .createWebsiteForUser(uid, website)
            .then(function (website) {
                res.json(website);
            });

    }

    function findAllWebsitesForUser(req, res) {
         // req.json(websites);
        var uid = req.params.userId;

        model
            .findAllWebsitesForUser(uid)
            .then(
                function (websites) {
                    if(websites) {
                        res.json(websites);
                    } else {
                        websites = null;
                        res.send(websites);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findWebsiteById(req, res) {
        var wid = req.params.websiteId;

        model
            .findWebsiteById(wid)
            .then(
                function (website) {
                    if(website) {
                        res.json(website);
                    } else {
                        website = null;
                        res.send(website);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateWebsite(req, res) {
        var website = req.body;
        var wid = req.params.websiteId;

        model
            .updateWebsite(wid, website)
            .then(
                function (website){
                    res.json(website)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteWebsite(req, res) {
        var uid = req.params.userId;
        var wid = req.params.websiteId;

        if(wid){
            model
                .deleteWebsite(uid, wid)
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