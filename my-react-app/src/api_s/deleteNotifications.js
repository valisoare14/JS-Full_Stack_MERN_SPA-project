async function deleteNotifications(token){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}notifications`,{
            method:"DELETE",
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        const result = await response.json()
        if(response.status!=200){
            throw new Error(result.message)
        }
        return 0
    } catch (error) {
        console.error(error)
    }
}

export {deleteNotifications}