async function createPortfolio(token , name){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}portfolio`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                name
            })
        })
        const result = await response.json()

        if(!response.ok) {
            throw new Error(result.message)
        }

        return result
    } catch (error) {
        console.error(error.message)
        return {message : error.message}
    }
}

export {createPortfolio}