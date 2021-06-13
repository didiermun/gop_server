const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const patrouilleSchema = new Schema({
    p_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Patrouille"
    },
    time:{
        type: String,
        required: true,
    },
    wpt:{
        type: Number,
        required: true,
    },
    remarks:[{
        type: String,
        required: true,
    }],
    sitename:{
        type: String,
        required: true,
    }, 
    number:{
        type: Number,
        required: true,
        min:1
    },
    observation:{
        type: String,
        required: true
    },
    otype:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default:"NONE"
    },
    northing: {
        type: Number,
        required: true
    },
    easting: {
        type: Number, 
        required: true
    }
},{
    timestamps: true
})

exports.Record = mongoose.model("Record", patrouilleSchema);