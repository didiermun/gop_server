const mongoose = require('mongoose')
const pagination = require('mongoose-paginate-v2')
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;

const bookMarksSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required: true,
    },
    bookmarks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Report',
        required: true
    }],
},{
    timestamps: true
});
bookMarksSchema.plugin(deepPopulate);
bookMarksSchema.plugin(pagination);
exports.Bookmark = mongoose.model("Bookmark", bookMarksSchema);