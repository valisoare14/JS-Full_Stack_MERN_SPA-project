async function getNotifications(token){
    try {
        if(token) {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}notifications`,{
                method:"GET",
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await response.json()
    
            if(response.status !== 200){
                throw new Error(result.message)
            }
    
            return result.data
        }
    } catch (error) {
        console.error(error)
    }
}

export {getNotifications}