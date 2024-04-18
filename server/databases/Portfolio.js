const { ref } = require('joi')
const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    name : String
},{
    versionKey : false
})

const Portfolio = mongoose.model('portfolio' , PortfolioSchema)

module.exports = Portfolio