async function addPortfolioAsset(token , portfolioId , symbol , market , quantity , mean_acquisition_price , fee ) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}portfolioasset`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                portfolioId , symbol , market , quantity , mean_acquisition_price , fee
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

export {addPortfolioAsset}