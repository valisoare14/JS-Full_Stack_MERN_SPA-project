async function updateWatchlistSymbols(collection,token){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}watchlist/${collection}`,{
            method:"GET",
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        const result = await response.json()
        if(!response.ok) {
            throw new Error(result.message)
        }
        if(result.data.length != 0) {
            return result.data.map(el=>el.symbol)
        }
        return []

    } catch (error) {
        console.error(error)
    }
}

export {updateWatchlistSymbols}
