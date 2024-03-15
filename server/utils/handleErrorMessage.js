function handleErrorMessage(res,message){
    console.error(new Error(message))
    return res.status(400).json({'message':message})
}

module.exports = handleErrorMessage