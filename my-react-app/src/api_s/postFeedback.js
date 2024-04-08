async function postFeedback(token , symbol , reaction , comment) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}feedbacks`,{
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                symbol,reaction,comment
            })
        })
        const result = await response.json()

        if(! response.ok) {
            throw new Error(result.message)
        }
        
    } catch (error) {
        console.error(error)
    }
}

export {postFeedback}