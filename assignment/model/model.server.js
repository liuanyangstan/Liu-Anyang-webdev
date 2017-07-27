/**
 * Created by stan on 7/21/17.
 */
module.exports = function (app) {

    var connectionString = null;

    if (process.env.MONGODB_URI) {
        // connectionString = 'mongodb://liuanyangstan@gmail.com:lay19911130@ds137891.mlab.com:37891/heroku_kn9tg11s';
        connectionString = 'mongodb://heroku_kn9tg11s:kcud6ujpp73mo6auo0rgr9m280@ds137891.mlab.com:37891/heroku_kn9tg11s';
    }
    else
    {
        connectionString = connectionString = 'mongodb://localhost:27017/cs5610Webdv';
    }

    var mongoose = require('mongoose');
    mongoose.connect(connectionString, {useMongoClient : true});

    var userModel = require('./user/user.model.server')(mongoose);
    var websiteModel = require("./website/website.model.server")(mongoose, userModel);
    var pageModel =  require("./page/page.model.server.js")(mongoose, websiteModel);
    var widgetModel = require("./widget/widget.model.server.js")(mongoose, pageModel);

    var models = {
        'userModel' : userModel,
        'websiteModel' : websiteModel,
        'pageModel' : pageModel,
        'widgetModel' : widgetModel
    };

    return models;

};