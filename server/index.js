require('dotenv').config()

const cors=require('cors')
const express=require('express')

const verifyToken = require('./utils/verifyToken')

const usersRoutes=require('./routes/users')
const authentificationRoutes=require('./routes/authentification')
const newsRoutes=require('./routes/news')
const notificationsRoutes=require('./routes/notifications')
const calendarRoutes=require('./routes/calendar')
const watchlistRoutes = require('./routes/watchlist')
const stockRoutes = require('./routes/stocks')
const cryptocurrenciesRoutes = require('./routes/cryptocurrencies')
const commoditiesRoutes = require('./routes/commodities')

//MDB
const Stock=require('./databases/Stock')
const Crypto=require('./databases/Crypto')
const Commodity=require('./databases/Commodity')
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

app.get('/', function (req, res) {
    res.status(200).send('Hello World')
})

app.listen(5000,()=>{
    console.log("Server is running on port 5000...")
});