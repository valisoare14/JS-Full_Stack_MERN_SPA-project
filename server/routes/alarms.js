const router = require('express').Router()
const Alarm = require('../databases/Alarm')
const {User} = require('../databases/User')

router.post('/' , async(req,res)=>{
    try {
        if(!req.body) {
            return res.status(400).json({message : "Invalid request !"})
        }
        if(Object.keys(req.body).length != 6 ) {
            return res.status(400).json({message :"Invalid properties"})    
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message :"User not found !"})    
        }

        const alarm = await new Alarm({
            userId : user._id,
            timestamp:Date.now(),
            ...req.body
        }).save()

        return res.status(200).json({
            data : alarm ,
            message : "Alarm created successfully !"
        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/:status' , async(req,res)=>{
    try {

        const status = req.params.status

        if(!process.env.ALARM_STATUS.includes(status)) {
            return res.status(400).json({message :"Invalid status received !"})    
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        const alarms = await Alarm.find({
            userId : user._id ,
            status : status
        })

        return res.status(200).json({
            data : alarms ,
            message : "Alarms fetched successfully !"
        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.delete('/' , async(req,res)=>{
    try {
        if(!req.body) {
            return res.status(400).json({message : "Invalid request !"})
        }
        if(Object.keys(req.body).length != 1 ) {
            return res.status(400).json({message :"Invalid properties"})    
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        const alert = await Alarm.findOne({
            _id : req.body._id
        })

        if(!alert) {
            return res.status(400).json({message : "Alert not found !"})
        }

        await Alarm.deleteOne({
            _id : alert._id
        })

        return res.status(200).json({message : "Alert deleted successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.put('/', async(req , res)=>{
    try {
        if(!req.body) {
            return res.status(400).json({message : "Invalid request !"})
        }
        if(Object.keys(req.body).length != 2 ) {
            return res.status(400).json({message :"Invalid properties"})    
        }
        const user = await User.findOne({
            _id : req.userId
        })
        
        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        await Alarm.findOneAndUpdate({
            _id : req.body._id
        },{
            $set : {status : req.body.status}
        })

        return res.status(200).json({message : `Alert ${req.body.status} successfully !`})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.put('/many', async(req , res)=>{
    try {
        if(!req.body) {
            return res.status(400).json({message : "Invalid request !"})
        }
        if(Object.keys(req.body).length != 2 ) {
            return res.status(400).json({message :"Invalid properties"})    
        }
        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        await Alarm.updateMany({
            _id : {$in :  req.body._ids}
        },{
            $set : {status : req.body.status}
        })

        return res.status(200).json({message : `Alerts ${req.body.status} successfully !`})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router