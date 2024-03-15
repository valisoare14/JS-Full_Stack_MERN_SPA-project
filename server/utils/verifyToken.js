const handleErrorMessage = require('./handleErrorMessage')
const jsonWebToken = require('jsonwebtoken')

function verifyToken(req,res,next){
    const bearerToken = req.headers['authorization']
    const token = bearerToken?.split(' ')[1]

    if(!token){
        return handleErrorMessage(res , 'Token not found !')
    }
    jsonWebToken.verify(token , process.env.JASON_WEB_TOKEN ,(error , decoded)=>{
        if(error) {
            return handleErrorMessage(res , 'Unathorized - Invalid token')
        }

        req.userId = decoded._id

        next()
    })
}

module.exports = verifyToken