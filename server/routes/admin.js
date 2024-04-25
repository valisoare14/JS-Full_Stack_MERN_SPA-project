const router = require('express').Router()
const bcrypt=require('bcrypt')
const Admin = require('../databases/Admin')
const { User } = require('../databases/User')
const verifyToken = require('../utils/verifyToken')
const jwt=require('jsonwebtoken')

router.post('/' , verifyToken ,async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1){
            return res.status(400).json({message : 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user)  {
            return res.status(400).json({message : 'User not found !'})
        }

        const noDoc = await Admin.countDocuments()

        if(noDoc === 1) {
            return res.status(400).json({message : 'Admin pass key allready exists !'})
        }

        const salt=await bcrypt.genSalt(Number(process.env.BCRYPT_SALT))
        const hashedPassword=await bcrypt.hash(req.body.password,salt)

        await new Admin({
            password : hashedPassword
        }).save()

        return res.status(200).json({message : 'Admin pass key created successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message: error.message})
    }
})

router.post('/authentification' , verifyToken ,async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1){
            return res.status(400).json({message : 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user)  {
            return res.status(400).json({message : 'User not found !'})
        }

        const admin = await Admin.findOne()
        const adminPassword = admin.password
        const isValidPassword = await bcrypt.compare(req.body.password , adminPassword)
        
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid password !"})
        }

        const token = jwt.sign({_id: user._id }, process.env.ADMIN_JWT_SECRET, {
            expiresIn: "4h",
        })

        return res.status(200).json({data:token,message:"Admin authentification successfull !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message: error.message})
    }
})

router.post('/verifytoken' , async(req,res)=>{
    try {
        const {token}=req.body
        if(!token){
            return res.status(400).json({message:"Token not found !"})
        }

        const isValidToken=jwt.verify(token , process.env.ADMIN_JWT_SECRET)

        if(!isValidToken){
            return res.status(400).json({message:"Invalid token !"})
        }

        return res.status(200).json({message:"Valid token !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router