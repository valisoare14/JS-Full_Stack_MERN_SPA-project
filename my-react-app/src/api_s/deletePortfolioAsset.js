async function deletePortfolioAsset(token , portfolio_asset_id , symbol){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}portfolioasset`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                portfolio_asset_id , symbol
            })
        })
        const result = await response.json()

        if(!response.ok) {
            throw new Error(result.message)
        }

        return result
    } catch (error) {
        console.error(error)
        return {message : error.message , success : false}
    }
}

export {deletePortfolioAsset}