const expres=require('express')
const router=expres.Router()
const {dateParser}=require('../utils/dateParser')

//db
const New=require('../databases/New')

function extractTickers(ticker_sentiment) {
    let tickersArray = []
    for(let tick_sentiment of ticker_sentiment) {
        tick_sentiment.map(el => tickersArray.push(el.ticker))
    }
    return tickersArray
}

router.get('/',async(req,res)=>{
    try {
        const key=process.env.ALPHA_VANTAGE_BASE_URL
        const url=process.env.ALPHA_VANTAGE_API_KEY

        //nr documente colectia news
        const docnumber=await New.countDocuments({})
        if(docnumber==0){
            try {
                const response= await fetch(`${key}function=NEWS_SENTIMENT&apikey=${url}`)
                const data=await response.json()
                const obs=await new New({
                    items:Number(data.items),
                    feed:data.feed.map(element=>({
                        title:element.title,
                        url:element.url,
                        time_published:dateParser(element.time_published.toString()),
                        authors:element.authors,
                        summary:element.summary,
                        banner:element.banner_image,
                        source:element.source,
                        topics:element.topics.map(item=>item.topic),
                        ticker_sentiment : element.ticker_sentiment.map(el=>({
                            ticker : el.ticker ,
                            relevance_score : el.relevance_score ,
                            ticker_sentiment_score : el.ticker_sentiment_score
                        })) ,
                        sentiment:element.overall_sentiment_label
                    })),
                    tickers : extractTickers(data.feed.map(element =>element.ticker_sentiment)),
                    timestamp:Date.now()
                }).save()
                return res.status(200).json(obs)
            } catch (error) {
                throw new Error(error.message)
            }
        }
        else{
            const doc=await New.find()
            const lastupdate=Number(((Date.now()-doc[0].timestamp)/60000).toFixed())
            //240 min -> 4h
            if(lastupdate>240){
                try {
                    const response= await fetch(`${key}function=NEWS_SENTIMENT&apikey=${url}`)
                    const data=await response.json()
                    await New.deleteMany()
                    const obs=await new New({
                        items:Number(data.items),
                        feed:data.feed.map(element=>({
                            title:element.title,
                            url:element.url,
                            time_published:dateParser(element.time_published.toString()),
                            authors:element.authors,
                            summary:element.summary,
                            banner:element.banner_image,
                            source:element.source,
                            topics:element.topics.map(item=>item.topic),
                            ticker_sentiment : element.ticker_sentiment.map(el=>({
                                ticker : el.ticker ,
                                relevance_score : el.relevance_score ,
                                ticker_sentiment_score : el.ticker_sentiment_score
                            })) ,
                            sentiment:element.overall_sentiment_label
                        })),
                        tickers : extractTickers(data.feed.map(element =>element.ticker_sentiment)),
                        timestamp:Date.now()
                    }).save()
                    return res.status(200).json(obs)
                } catch (error) {
                    throw new Error(error.message)
                }
            }
            else{
                const data=await New.find()
                return res.status(200).json(data[0])
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

module.exports=router