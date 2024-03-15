const express=require('express')
const router=express.Router()
const {User,validate}=require('../databases/User')
const Token=require('../databases/Token')
const bcrypt=require('bcrypt')
const {sendEmail}=require('../utils/sendEmail')
const jwt=require('jsonwebtoken')

router.post('/',async(req,res)=>{
    try {
        const {error}=validate(req.body,"authentification")

        if(error){
            return res.status(400).json({message:error.details[0]})
        }
        const user=await User.findOne({
            email:req.body.email
        })
        if(!user){
            return res.status(400).json({message:"Invalid email !"})
        }
        
        
        const isValidPassword=await bcrypt.compare(req.body.password,user.password)
        
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid password !"})
        }

        if(!user.verified){
            let token=await Token.findOne({
                userId:user._id
            })
            if(!token){
                token=await new Token({
                    userId:user._id,
                    token:crypto.randomBytes(32).toString('hex')
                }).save
            }
            await sendEmail(user.email,"Verify Email",`${process.env.BASE_URL_FRONTEND}users/verify/${user._id}/${token.token}`)

        }
        const token = jwt.sign({_id: user._id }, process.env.JASON_WEB_TOKEN, {
            expiresIn: "4h",
        })
        return res.status(200).json({data:token,message:"Authentification succesfull !"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error !"})   
    }
})

router.post('/verifytoken',(req,res)=>{
   try {
        const {token}=req.body
        if(!token){
            return res.status(400).json({message:"Token not found !"})
        }

        const isValidToken=jwt.verify(token , process.env.JASON_WEB_TOKEN)

        if(!isValidToken){
            return res.status(400).json({message:"Invalid token !"})
        }

        return res.status(200).json({message:"Valid token !"})
   } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
   }
})

module.exports=router