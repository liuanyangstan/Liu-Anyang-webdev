/**
 * Created by stan on 8/8/17.
 */
module.exports = function(){

    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({

        username : {type : String, required : true},
        password : {type : String, required : true},
        firstName : String,
        lastName : String,
        email : String,
        dateCreated : {
            type : Date,
            default: Date.now
        },
        google : {
            id: String,
            token: String
        },
        isAdmin : Boolean,
        followers : [{type: mongoose.Schema.Types.ObjectId, ref: "nuserModel"}],
        following : [{type: mongoose.Schema.Types.ObjectId, ref: "nuserModel"}]

    }, {collection: 'project.user'});

    return userSchema;
};