require('dotenv').config()

const cors=require('cors')
const express=require('express')

const verifyToken = require('./utils/verifyToken')
const verifyAdminToken = require('./utils/verifyAdminToken')

const usersRoutes=require('./routes/users')
const authentificationRoutes=require('./routes/authentification')
const newsRoutes=require('./routes/news')
const notificationsRoutes=require('./routes/notifications')
const calendarRoutes=require('./routes/calendar')
const watchlistRoutes = require('./routes/watchlist')
const stockRoutes = require('./routes/stocks')
const cryptocurrenciesRoutes = require('./routes/cryptocurrencies')
const commoditiesRoutes = require('./routes/commodities')
const alarmsRoutes = require('./routes/alarms')
const feedbacksRoutes = require('./routes/feedbacks')
const symbolsRoutes = require('./routes/symbols')
const portfolioAssetRoutes = require('./routes/portfolioasset')
const transactionsRoutes = require('./routes/transactions')
const portfolioRoutes = require('./routes/portfolios')
const verificationRoutes = require('./routes/verification')
const adminRoutes = require('./routes/admin')
const adminSymbolsRoutes = require('./routes/adminsymbols')
const analysesRoutes = require('./routes/analyses')

//MDB
const mdbconnect=require('./databases/database')

const app = express()

//setting up the mdb connection
mdbconnect()


app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

//routes
app.use('/users',usersRoutes)
app.use('/authentification',authentificationRoutes)
app.use('/news',newsRoutes)
app.use('/notifications', verifyToken,notificationsRoutes)
app.use('/calendar',calendarRoutes)
app.use('/watchlist',verifyToken,watchlistRoutes)
app.use('/stocks' , stockRoutes)
app.use('/cryptocurrencies',cryptocurrenciesRoutes)
app.use('/commodities',commoditiesRoutes)
app.use('/alarms',verifyToken,alarmsRoutes)
app.use('/feedbacks' ,verifyToken ,feedbacksRoutes)
app.use('/symbols', symbolsRoutes)
app.use('/portfolioasset',verifyToken , portfolioAssetRoutes)
app.use('/transactions',verifyToken , transactionsRoutes)
app.use('/portfolio',verifyToken , portfolioRoutes)
app.use('/account',verifyToken , verificationRoutes)
app.use('/admin', adminRoutes)
app.use('/adminsymbols', verifyAdminToken ,adminSymbolsRoutes)
app.use('/analyses',analysesRoutes)



app.get('/', function (req, res) {
    res.status(200).send('Hello World')
})



app.listen(5000,()=>{
    console.log("Server is running on port 5000...")
});