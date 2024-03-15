const express=require('express')

const {User,validate} =require('../databases/User')
const Token=require('../databases/Token')

const bcrypt=require('bcrypt')
const crypto=require('crypto')
const {sendEmail}=require('../utils/sendEmail')

const router=express.Router()

router.post('/' ,async(req,res)=>{
    try {
        const {error}=validate(req.body,"createaccount")
        if(error){
            //400 - bad request
            return res.status(400).json({message:error.details[0]})
        }

        //docnumber==0 -> baza de date User este goala(nu exista useri)
        const docnumber=await User.countDocuments({})

        if(docnumber!=0){
            const user=await User.findOne({email:req.body.email})
            if(user){
                // 409 -> data conflict
                return res.status(409).json({message:"User allready exists"})
            }
        }

        //criptare parola
        const salt=await bcrypt.genSalt(Number(process.env.BCRYPT_SALT))
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        //inserare DB
        const user=await new User({...req.body,password:hashedPassword}).save()
        const token=await new Token({
            userId:user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()
        //trimitere email de confirmare
        await sendEmail(user.email,"Verify Email",`${process.env.BASE_URL_FRONTEND}users/verify/${user._id}/${token.token}`)

        //201 - resource created
        return res.status(201).json({message:"Authentification email sent succesfully !"})
    } catch (error) {
        console.error(error)
        //500 - Internal Server Error 
        return res.status(500).json({message:"Internal Server Error !"})
    }
})

router.get('/verify/:id/:token',async(req,res)=>{
    try {
        const {id,token}=req.params
        const user=await User.findOne({
            _id:id
        })

        if(!user){
            return res.status(400).json({message:"User not found !"})
        }

        const token_=await Token.findOne({
            userId:user._id,
            token:token
        })

        if(!token_){
            return res.status(400).json({message:"Authentification link expired !"})
        }

        await User.updateOne({verified:true})
        await Token.deleteMany()

        return res.status(200).json({message:"Email verified succesfully !"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error !"})
    }
})

module.exports=router
