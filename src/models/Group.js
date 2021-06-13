const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    leader:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

},{
    timestamps: true
});
exports.Group = mongoose.model("Group", GroupSchema);