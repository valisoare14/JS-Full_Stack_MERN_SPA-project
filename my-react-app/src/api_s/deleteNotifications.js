async function deleteNotifications(){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}notifications`,{
            method:"DELETE"
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