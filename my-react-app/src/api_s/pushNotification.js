async function pushNotification(notification){
    try {
        const response=await fetch(`${process.env.REACT_APP_LOCAL_SERVER}notifications/`,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message:notification})
        })
        const result=await response.json()
        if(response.status!= 200){
            throw new Error(result.message)
        }

        return result.data
    } catch (error) {
        console.error(error)
    }
    
}

export {pushNotification}