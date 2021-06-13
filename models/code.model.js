const mongoose = require('mongoose')
const {codeLevels} = require("./enums.model")

const Schema = mongoose.Schema;

const codeSchema = new Schema({
    code:{
        type: String,
        min: 7,
        max: 7,
        required: true,
    },
    level:{
        type: String,
        required: true,
        enum: codeLevels,
        default:"USER"
    }
},{
    timestamps: true
});

exports.Code = mongoose.model("Code", codeSchema);