/**
 * Created by stan on 8/8/17.
 */
module.exports = function () {

    var connectionString = null;

    if (process.env.MONGODB_URI) {

        connectionString = 'mongodb://heroku_kn9tg11s:kcud6ujpp73mo6auo0rgr9m280@ds137891.mlab.com:37891/heroku_kn9tg11s';
    }
    else
    {
        connectionString = connectionString = 'mongodb://localhost:27017/cs5610Web-Project';
    }


    var mongoose = require('mongoose');
    mongoose.connect(connectionString, {useMongoClient : true});
    mongoose.Promise = require('q').Promise;

    var nuserModel = require('./nuser/nuser.model.server')();

    var models = {
        'nuserModel' : nuserModel
    };

    return models;
};
