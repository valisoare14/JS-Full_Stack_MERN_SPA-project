async function postAlert( asset,priceTarget , token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}alarms`,{
            method:"POST" ,
            headers : {
                'Authorization' :`Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                symbol : asset.symbol ,
                name : asset.name ,
                priceAtSubmission : asset.current_price,
                image : asset.image ? asset.image : null,
                priceTarget : priceTarget,
                status :"active"
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

export {postAlert}