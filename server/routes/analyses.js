const router = require('express').Router()
const Analysis = require('../databases/Analysis')
const {User} = require('../databases/User')

const verifyToken = require('../utils/verifyToken')
const verifyAdminToken = require('../utils/verifyAdminToken')

router.post('/' , verifyAdminToken , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 3) {
            return res.status(400).json({message : 'Invalid request !'})
        }
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }
        const analysis = await new Analysis({
            ...req.body
        }).save()
        return res.status(200).json({data : analysis , message : 'Analysis created successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/' , verifyToken , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const analyses = await Analysis.find()
        return res.status(200).json({data : analyses , message : 'Analyses retrieved successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.delete('/:id' , verifyAdminToken , async(req,res)=>{
    try {
        
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const {id} = req.params

        await Analysis.deleteOne({
            _id : id
        })

        return res.status(200).json({message : 'Analysis deleted successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.delete('/' , verifyAdminToken , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        await Analysis.deleteMany()

        return res.status(200).json({message : 'Analyses deleted successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router