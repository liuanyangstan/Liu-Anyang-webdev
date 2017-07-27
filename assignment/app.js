/**
 * Created by stan on 6/30/17.
 */
//
// var mongoose = require('mongoose');
// mongoose.Promise = require('q').Promise;
// mongoose.connect('mongodb://localhost:5000/');


module.exports = function(app){

    var models = require("./model/model.server")(app);

    require("./services/user.service.server.js")(app, models);
    require("./services/website.service.server.js")(app, models);
    require("./services/page.service.server")(app, models);
    require("./services/widget.service.server")(app, models);
};