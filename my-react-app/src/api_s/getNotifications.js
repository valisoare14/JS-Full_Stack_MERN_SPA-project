async function getNotifications(){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}notifications`)
        const result = await response.json()

        if(response.status !== 200){
            throw new Error(result.message)
        }

        return result.data
    } catch (error) {
        console.error(error)
    }
}

export {getNotifications}