async function deleteAlert(_id , token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}alarms`,{
            method:"DELETE",
            headers : {
                "Authorization" :`Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                _id
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

export {deleteAlert}