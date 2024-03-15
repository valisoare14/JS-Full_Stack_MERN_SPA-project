const express=require('express')
const router=express.Router()
const Calendar=require('../databases/Calendar')
const {fetchCalendarEvents} = require('../apis/fetchCalendarEvents')


router.get('/:currentDay/:weeksBack/:weeksFront',async(req,res)=>{
    try {
        var {currentDay,weeksBack,weeksFront} = req.params
        weeksBack=Number(weeksBack)
        weeksFront=Number(weeksFront)
        if(typeof weeksBack != 'number' || typeof weeksFront != 'number'){
            throw new Error('Invalid body type !')
        }
        const startOfDay = new Date(Number(currentDay)).setHours(0,0,0,0)
        const endOfDay = new Date(Number(currentDay)).setHours(23,59,59,999)

        const noDocs=await Calendar.countDocuments()
        if(noDocs == 0){
            await fetchCalendarEvents(weeksBack,weeksFront)
        } else {
            const doc=await Calendar.findOne()
            const lastupdate=Number(((Date.now()-doc.timestamp)/60000).toFixed())
            if(lastupdate > 30){
                await Calendar.deleteMany()
                await fetchCalendarEvents(weeksBack,weeksFront)
            }
        }
        
        const data = await Calendar.find({
            date:{
                $gte:startOfDay,
                $lte:endOfDay
            }
        })
        return res.status(200).json({'data' : data , message : "Data retrieved succesfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports=router

