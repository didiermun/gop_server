const mongoose = require('mongoose')

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
exports.Bookmark = mongoose.model("Bookmark", bookMarksSchema);