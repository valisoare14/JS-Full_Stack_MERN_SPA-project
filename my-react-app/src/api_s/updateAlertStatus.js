async function updateAlertStatus(_id , status , token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}alarms`,{
            method:"PUT",
            headers : {
                "Authorization" :`Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                _id , status
            })
        })
        const result = await response.json()
        if(!response.ok) {
            throw new Error(result.message)
        }
    } catch (error) {
        console.error(error)
    }
}

export {updateAlertStatus}