//Utilizarea variabilelor de mediu in aplicatii React:
//nu trebuie importat modulul dotenv si nici configurat(folosind .config()), ci trebuie doar instalat
//variabilele de mediu React trebuie preficate cu 'REACT_APP_'
async function fetchServer(symbol){
    try {
        const response=await fetch(`${process.env.REACT_APP_LOCAL_SERVER}${symbol}`)
        const data=await response.json()
        return data
    } catch (error) {
      console.error(error)
    }
}

export {fetchServer}

//CoinGecko
// Total Monthly API Calls
// 0 / 10,000
// Rate Limit - Request Per Minute
// 30


//FMP
//
//250 calls per day


//Finnhub
//Rate Limits
//If your limit is exceeded, you will receive a response with status code 429.
//On top of all plan's limit, there is a 30 API calls/ second limit
