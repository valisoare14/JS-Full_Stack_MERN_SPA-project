async function fetchAlerts(collection , token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}alarms/${collection}`,{
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        })
        const result = await response.json()

        if(!response.ok) {
            throw new Error(result.message)
        }

        return result.data
    } catch (error) {
        console.error(error)
    }
}

export {fetchAlerts}