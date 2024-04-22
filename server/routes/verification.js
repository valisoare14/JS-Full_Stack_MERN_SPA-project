const router=require('express').Router()
const {User,validate}=require('../databases/User')
const bcrypt=require('bcrypt')

router.post('/verifypassword' , async (req,res)=>{
    try {
        if(Object.keys(req.body).length != 1) {
            return res.status(400).json({message : "Invalid request !" , success : false})    
        }
        const {error}=validate(req.body,"accountupdate")

        if(error) {
            return res.status(400).json({message:error.details[0] , success : false})
        }

        const {password} = req.body

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: "User not found !" , success : false})
        }

        const isValidPassword=await bcrypt.compare(password,user.password)
        
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid password !" , success : false})
        }


        return res.status(200).json({message : "Correct password !" , success : true})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message , success : false})
    }
})

router.put('/changepassword' , async(req,res)=>{
    try {   
        if(Object.keys(req.body).length != 1) {
            return res.status(400).json({message : "Invalid request !" , success : false})    
        }
        const {error}=validate(req.body,"accountupdate")

        if(error) {
            return res.status(400).json({message:error.details[0] , success : false})
        }

        const {password} = req.body

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: "User not found !" , success : false})
        }

        //criptare parola
        const salt=await bcrypt.genSalt(Number(process.env.BCRYPT_SALT))
        const newPassword=await bcrypt.hash(password,salt)

        await User.findOneAndUpdate({
            _id : user._id
        },{
            $set : {
                password : newPassword
            }
        })

        return res.status(200).json({message: "Password changed successfully !" , success : true})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message , success : false})
    }
})

module.exports=router