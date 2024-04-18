async function getTransactionsByPortfolioAssetId(token , portfolioasset_id){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}transactions/${portfolioasset_id}`,{
            method : "GET",
            headers : {
                'Authorization' : `Bearer ${token}`
            }
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

export {getTransactionsByPortfolioAssetId}