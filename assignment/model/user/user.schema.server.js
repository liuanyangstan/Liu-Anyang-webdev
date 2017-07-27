/**
 * Created by stan on 7/20/17.
 */
// var mongoose = require('mongoose');
// var userSchema = mongoose.Schema({
//     username: String,
//     password: String,
//     firstName: String,
//     lastName: String,
//     email: String,
//     dateCreated: Date
// });
// module.exports = userSchema;

module.exports = function(mongoose){
    var websiteSchema = require("../website/website.schema.server")(mongoose);
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        username : {type : String, required : true},
        password : {type : String, required : true},
        firstName : String,
        lastName : String,
        email : String,
        phone : String,
        websites : [{
            type: Schema.Types.ObjectId,
            ref : 'websiteModel'
        }],
        dateCreated : {
            type : Date,
            default: Date.now
        }
    }, {collection: 'user'});

    return userSchema;
};