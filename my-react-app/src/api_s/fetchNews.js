async function fetchNews(){
    try {
        const response =await fetch(`${process.env.REACT_APP_LOCAL_SERVER}news`)
        const data=await response.json()
        if(!response.ok) {
            throw new Error(data.message)
        }
        return data
    } catch (error) {
        console.error(error)
    } 
}

export {fetchNews}

//Alpha Vantage
//25 requests per day.