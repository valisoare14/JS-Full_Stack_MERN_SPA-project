async function deleteTransaction(token , transaction_id) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}transactions`,{
            method : "DELETE",
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                transaction_id
            })
        })
        const result = await response.json()   

        if(!response.ok) {
            throw new Error(result.message)
        }

        return result
    } catch (error) {
        console.error(error)
        return {message : error.message}
    }
}

export {deleteTransaction}