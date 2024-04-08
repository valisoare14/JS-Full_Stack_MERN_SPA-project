async function getAssetDetailsBySymbol(data , market) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}${market}/symbols`,{
            method : "POST",
            headers :{
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "data": data.toString()
            })
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

export {getAssetDetailsBySymbol}