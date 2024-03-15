const mongoose=require('mongoose')

module.exports=()=>{
    mongoose
    .connect(`${process.env.DB_CONNECTION_STRING}/portfoliomanager`)
    .then(()=>console.log('Connected to MongoDB collections...'))
    .catch(err=>console.error(err))
}