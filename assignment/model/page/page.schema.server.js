/**
 * Created by stan on 7/24/17.
 */

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var pageSchema = mongoose.Schema({
            _website: {type: mongoose.Schema.Types.ObjectId, ref: "websiteModel"},
            name: {type: String, required: true},
            title: String,
            description: String,
            widgets: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'widgetModel'
            }],
            dateCreated: {
                type: Date,
                default: Date.now
            }
    },{collection: 'page'});

    return pageSchema;
};