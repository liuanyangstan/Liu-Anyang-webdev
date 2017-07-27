/**
 * Created by stan on 7/24/17.
 */

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var widgetSchema = mongoose.Schema({
            _page: {type: mongoose.Schema.Types.ObjectId, ref: "pageModel"},
            widgetType : {
            type : String,
                uppercase : true,
                enum : ['HEADING', 'IMAGE', 'YOUTUBE', 'HTML', 'TEXT']
            },
            name : String,
            text : String,
            placeholder : String,
            description : String,
            url : String,
            width : String,
            height : String,
            rows : Number,
            size : {
                type : Number,
                default : 1
            },
            class : String,
            icon : String,
            deletable : {type : Boolean, default : true},
            formatted : Boolean,
            dateCreated : {
                type : Date,
                default: Date.now
            }
            // index : Number
    }, {collection : 'widget'});

    return widgetSchema;

};