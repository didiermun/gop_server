const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const statSchema = new Schema({
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    numberOfReports:{
        type: Number,
        required: true,
    }
},
{
    timestamps: true
});


exports.Stats = mongoose.model("Stat", statSchema);