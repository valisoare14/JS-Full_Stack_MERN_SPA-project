async function manageWatchlistAsset(method , symbol , token,market){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}watchlist`,{
            method :method,
            headers :{
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body :JSON.stringify({symbol,market})
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

export {manageWatchlistAsset}