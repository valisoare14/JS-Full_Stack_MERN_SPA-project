async function getFeedbacks(token , symbol) {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}feedbacks/${symbol}`,{
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        })
        const result = await response.json()

        if(! response.ok) {
            throw new Error(result.message)
        }
        
        return {
            feedbacks : result.data , 
            feedbackGiven : result.feedbackGiven
        }
    } catch (error) {
        console.error(error)
    }
}

export {getFeedbacks}