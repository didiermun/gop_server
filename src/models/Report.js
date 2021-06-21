const mongoose = require('mongoose')
const pagination = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reporter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    timing:{
        start: {
            type: String,
            required: true
        },
        end:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
    },
    baseInfo: {
        family: {
            type: String,
            required: true
        },
        habituated:{
            type: String,
            required: true
        },
        village:{
            type: String,
            required: true
        },
        distance:{
            type: String,
            required: true
        },
        location:{
            type: String,
            required: true
        },
        individuals:{
            type: Number,
            required: true
        },
        Oindividuals:{
            type: Number,
            required: true
        }
    },
    budget:{
        feeding:[{
            type: String,
            required: true
        }],
        distance:{
            type: String,
            required: true
        },
        period:{
            type: String,
            required: true
        }
    },
    interaction:{
        distance:{
            type: String,
            required: true
        },
        reaction:[{
            type: String,
            required: true
        }],
        observation:[{
            type: String,
            required: true
        }],
        behaviour:[{
            type: String,
            required: true
        }],
    },
    touristActivity:{
        tourist:{
            type: Number,
            required: true
        },
        period:{
            type: String,
            required: true
        },
        behaviour:[{
            type: String,
            required: true
        }],
    },
    health:{
        sick:{
            type: Boolean,
            required: true
        },
        signs:[{
            type: String,
            required: true
        }],
    }
},{
    timestamps: true
});

reportSchema.plugin(pagination);
exports.Report = mongoose.model("Report", reportSchema);