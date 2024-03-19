const express=require('express')
const router=express.Router()

//database
const Notification=require('../databases/Notification')
const {User} = require('../databases/User')

router.post('/',async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findOne({
            _id : userId
        })
        if(!user) {
            return res.status(400).json({message :"User not found !"})
        }
        if(Object.keys(req.body).length==0){
            throw new Error("Please provide a message for the notification !")
        }

        if(req.body.message == undefined){
            throw new Error("Unusual request body !")
        }
        const message_=req.body.message
        const notification=await new Notification({
            userId:userId,
            message:message_,
            timestamp:Date.now()
        }).save()
        return res.status(200).json({data:notification , message:"Notification posted succesfully !"})

    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.get('/',async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findOne({
            _id : userId
        })
        if(!user) {
            return res.status(400).json({message :"User not found !"})
        }
        const docnumber=await Notification.countDocuments({
            userId : userId
        })
        if(docnumber==0){
            return res.status(400).json({message:"No notification found !"})
        }

        const notifications=await Notification.find({
            userId : userId
        })
        return res.status(200).json({data:notifications , message:"Notifications found succesfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.delete('/',async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findOne({
            _id : userId
        })
        if(!user) {
            return res.status(400).json({message :"User not found !"})
        }
        await Notification.deleteMany({
            userId : userId
        })
        return res.status(200).json({message:"All notifications were deleted !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

module.exports=router