const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    password :{ 
        type: String, 
        required: true 
    }
},{versionKey:false})

const Admin = mongoose.model('admins' , AdminSchema)

module.exports=Admin