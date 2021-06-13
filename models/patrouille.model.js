const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const {PTypes,Families,Compositions} = require("./enums.model")

const patrouilleSchema = new Schema({
    date:{
        type: Date,
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum:PTypes
    },
    sector:{
        type: Number,
        required: true,
        max:5,
        min:1
    },
    family:{
        type: String,
        required: true,
        enum:Families
    },
    composition:{
        type: String,
        required: true,
        enum:Compositions
    }, 
    nTeamMembers:{
        type: Number,
        required: true,
        min:1
    },
    names:[{
        type: String,
        required: true
    }],
    teamLeader:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true,
        default:"Itenaire"
    },
    gpsNO:{
        type: Number,
        required: true
    },
    feuilleNO:{
        type: Number, 
        required: true
    },
    status:{
        type: String,
        required: true,
        default:"NONE"
    }
},{
    timestamps: true
})

exports.Patrouille = mongoose.model("Patrouille", patrouilleSchema);