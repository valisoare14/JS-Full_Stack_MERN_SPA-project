async function addTransaction(token, portfolio_asset_id,quantity,price,fee,type){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}transactions`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                portfolio_asset_id : portfolio_asset_id,
                quantity : quantity,
                price : price,
                fee : fee,
                type : type
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

export {addTransaction}