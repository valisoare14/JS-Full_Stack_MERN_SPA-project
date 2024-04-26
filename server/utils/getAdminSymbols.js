const AdminSymbols = require('../databases/AdminSymbol')

async function getAdminSymbols(collection){
    try {
        const adminSymbolsObject = await AdminSymbols.findOne()
        return adminSymbolsObject[collection].symbols
    } catch (error) {
        console.error(err)
    }
}

module.exports = getAdminSymbols