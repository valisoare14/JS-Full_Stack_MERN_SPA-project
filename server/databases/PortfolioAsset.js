const mongoose = require('mongoose')

const PortfolioAssetSchema = new mongoose.Schema({
    portfolioId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'portfolio'
    },
    symbol :{
        type : String
    },
    market : String,
    quantity : Number,
    mean_acquisition_price : Number    
},{
    versionKey : false
})

const PortfolioAsset = mongoose.model('portfolioasset' , PortfolioAssetSchema)

module.exports = PortfolioAsset