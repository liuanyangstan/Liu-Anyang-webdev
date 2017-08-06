/**
 * Created by stan on 7/20/17.
 */

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
        },
        google: {
            id: String,
            token: String
        }
    }, {collection: 'user'});

    return userSchema;
};