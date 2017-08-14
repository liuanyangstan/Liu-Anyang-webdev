/**
 * Created by stan on 8/8/17.
 */
module.exports = function(app){

    var mongoose = require('mongoose');

    var models = require("./model/model.server")(mongoose);

    require("./services/home.service.server")(app);
    require("./services/nuser.service.server.js")(app, models.nuserModel);
};
