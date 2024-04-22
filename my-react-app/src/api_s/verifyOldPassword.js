async function verifyOldPassword(token , oldPassword){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}account/verifypassword`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                password : oldPassword
            })
        })
        const result = await response.json()

        if(!response.ok) {
            throw new Error(result.message)
        }

        return result
    } catch (error) {
        console.error(error)
        return {message : error.message , success : false}
    }
}

export {verifyOldPassword}