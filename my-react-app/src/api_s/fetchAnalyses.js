async function fetchAnalyses(token){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}analyses`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        const result = await response.json()

        if(!response.ok){
            throw new Error(result.message)
        }

        return result
    } catch (error) {
        console.error(error)
        return {message : error.message}
    }
}

export {fetchAnalyses}