const mongoose = require('mongoose')

const AnalysisSchema = new mongoose.Schema({
    title : String,
    topics : [String],
    content : String,
    time_published : {
        type : Date,
        default : Date.now
    }
},{versionKey : false})

const Analysis = mongoose.model('analysis'  ,AnalysisSchema)

module.exports = Analysis