import { calculateProportion } from "../utils/calculateProportion"
import { fetchNews } from "./fetchNews"
import { getAllFeedbacks } from "./getAllFeedbacks"
import { getAssetDetailsBySymbol } from "./getAssetDetailsBySymbol"

async function fetchMarketSentiment(token) {
    try {
        let response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}symbols/stocks`)
        let result = await response.json()
        if(!response.ok) {
            throw new Error(result.message)
        }
        const stocksSymbols = result.symbols
       
        response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}symbols/cryptocurrencies`)
        result = await response.json()
        if(!response.ok) {
            throw new Error(result.message)
        }

        const cryptocurrenciesSymbols = result.symbols
       
        const news = await fetchNews()
        let newsTickers = news.tickers

        function searchTicker(ticker) {
            for(let symbol of cryptocurrenciesSymbols) {
                if(ticker.toLowerCase().includes(symbol.toLowerCase())) {
                    return true
                }
            }
            return false
        }
        
        newsTickers = newsTickers.filter(el => 
           stocksSymbols.includes(el) || searchTicker(el)
        )
        
        newsTickers = newsTickers.map(ticker => {
            if(ticker.substring(0,6) === "CRYPTO") {
                ticker = ticker.substring(7,undefined).toLowerCase()
            }
            return ticker
        })
        
        const feedbacks = await getAllFeedbacks(token)
        
        const feedbackTickers = Array.from(new Set(feedbacks.map(el => el.symbol)))
        
        let sentimentTickers = Array.from(new Set(newsTickers.concat(feedbackTickers)))
        
        sentimentTickers = sentimentTickers.map(el => ({
            ticker : el ,
            news : newsTickers.includes(el),
            feedback : feedbackTickers.includes(el),
            market : cryptocurrenciesSymbols.includes(el) ? "cryptocurrencies" :  stocksSymbols.includes(el) ? "stocks" : 'commodities',
            comments : feedbackTickers.includes(el) ? feedbacks.filter(f => f.symbol === el).map(e=>{
                return ({
                    userId : e.userId ,
                    comment : e.comment
                })
            }) : undefined
        }))
        
        const cryptocurrenciesDetails = await getAssetDetailsBySymbol(
            sentimentTickers.filter(el => el.market === "cryptocurrencies").map(el => el.ticker),
            "cryptocurrencies"
        )
        
        const stocksDetails = await getAssetDetailsBySymbol(
            sentimentTickers.filter(el => el.market === "stocks").map(el => el.ticker),
            "stocks"
        )

        const commoditiesDetails = await getAssetDetailsBySymbol(
            sentimentTickers.filter(el => el.market === "commodities").map(el => el.ticker),
            "commodities"
        )
        
        sentimentTickers.forEach(el => {
            return el.name = (el.market === "cryptocurrencies" ? 
            cryptocurrenciesDetails.find(e => e.symbol == el.ticker)?.name : el.market === "stocks" ?
            stocksDetails.find(e => e.symbol == el.ticker)?.name : commoditiesDetails.find(e => e.symbol == el.ticker)?.name)
        })

        function verifyInterval(value) {
            if(value <= -0.35) {
                return "Bearish"
            }
            if(value > -0.35 && value <= -0.15) {
                return "Somewhat-Bearish"
            }
            if(value > -0.15 && value < 0.15) {
                return "Neutral"
            }
            if(value >= 0.15 && value < 0.35) {
                return "Somewhat-Bullish"
            }
            return "Bullish"
        }

        sentimentTickers.forEach(el => {
            el.investors_sentiment = undefined
            el.market_sentiment = undefined
            el.investors_score = undefined
            el.market_score = undefined
            el.related_news = undefined
            if (el.feedback) {
                const proportionArray = calculateProportion(feedbacks.filter(f => f.symbol == el.ticker))
                if(proportionArray[0] >= proportionArray[1]) {
                    el.investors_score = proportionArray[0]/100 - 0.5
                    el.investors_sentiment = verifyInterval(proportionArray[0]/100 - 0.5)
                } else {
                    el.investors_score = 0.5 - proportionArray[1]/100
                    el.investors_sentiment = verifyInterval(0.5 - proportionArray[1]/100)
                }
                if(el.news){
                    let targetNews = news.feed.filter(n => {
                        const ntickers = n.ticker_sentiment.map(nn => nn.ticker)
                        for(let nticker of ntickers) {
                            if(nticker.toLowerCase().includes(el.ticker.toLowerCase())) {
                                return true
                            }
                        }
                        return false
                    })
                    el.related_news = targetNews.map(n => ({
                        title : n.title ,
                        url : n.url
                    }))

                    let targetNewsSentiment = targetNews.map(tn => {
                        const ticker_sentiment =  tn.ticker_sentiment.find(tnn => tnn.ticker.toLowerCase().includes(el.ticker.toLowerCase()))
                        return({
                            relevance_score : ticker_sentiment.relevance_score,
                            ticker_sentiment_score : ticker_sentiment.ticker_sentiment_score
                        })
                    })
                    let market_sentiment_score = 0
                    for(let targetNewSentiment of targetNewsSentiment) {
                        market_sentiment_score 
                            += 
                                targetNewSentiment.relevance_score * targetNewSentiment.ticker_sentiment_score 
                            + 
                                (1-targetNewSentiment.relevance_score) 
                                * 
                                (proportionArray[0] >= proportionArray[1] ? proportionArray[0]/100 - 0.5 : 0.5 - proportionArray[1]/100) 
                    }
                    market_sentiment_score = market_sentiment_score / targetNewsSentiment.length
                    el.market_score = market_sentiment_score
                    el.market_sentiment = verifyInterval(market_sentiment_score)
                }
            } else {
                let targetNews = news.feed.filter(n => {
                    const ntickers = n.ticker_sentiment.map(nn => nn.ticker)
                    for(let nticker of ntickers) {
                        if(nticker.toLowerCase().includes(el.ticker.toLowerCase())) {
                            return true
                        }
                    }
                    return false
                })
                el.related_news = targetNews.map(n => ({
                    title : n.title ,
                    url : n.url
                }))

                let targetNewsSentiment = targetNews.map(tn => {
                    const ticker_sentiment =  tn.ticker_sentiment.find(tnn => tnn.ticker.toLowerCase().includes(el.ticker.toLowerCase()))
                    return({
                        relevance_score : ticker_sentiment.relevance_score,
                        ticker_sentiment_score : ticker_sentiment.ticker_sentiment_score
                    })
                })
                let market_sentiment_score = 0
                for(let targetNewSentiment of targetNewsSentiment) {
                    market_sentiment_score += targetNewSentiment.relevance_score * targetNewSentiment.ticker_sentiment_score 
                }
                market_sentiment_score = market_sentiment_score / targetNewsSentiment.length
                el.market_score = market_sentiment_score
                el.market_sentiment = verifyInterval(market_sentiment_score)
            }
        })
        return sentimentTickers
    } catch (error) {
        console.error(error)
    }
}

export {fetchMarketSentiment}