const router = require('express').Router()
const Feedback = require('../databases/Feedback')
const {User} = require('../databases/User')

router.post('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 3) {
            return res.status(400).json({message : "Invalid request !"})
        }

        const user = await  User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        await new Feedback({
            userId : req.userId ,
            symbol : req.body.symbol,
            reaction : req.body.reaction,
            comment : req.body.comment,
            timestamp : Date.now()
        }).save()

        return res.status(200).json({message : "Feedback posted successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/:symbol' , async(req,res)=>{
    try {

        const symbol = req.params.symbol

        const user = await  User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        const feedbacks = await Feedback.find({
            symbol : symbol
        })

        return res.status(200).json({
            data : feedbacks,
            feedbackGiven : feedbacks.length!=0 && (feedbacks.map(e => e.userId.toString()).includes(user._id.toString()) ? feedbacks.find(e => e.userId.toString() === user._id.toString()).reaction : null),
            message : `Feedbacks retrieved successfully for ${symbol} !`
        })
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/' , async (req,res)=>{
    try {
        const user = await  User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        const feedbacks = await Feedback.find()

        return res.status(200).json({
            data : feedbacks ,
            message : `Feedbacks retrieved successfully !`
        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router