import { useState } from "react"

function MarketSentimentItem(props) {
    const {item} = props
    const [readMore , setReadMore] = useState(false)
    return(
        <div className="flex flex-col text-xxxs xxs:text-xxs sm:text-sm font-mono border mt-1 mb-1 sm:mt-3 sm:mb-3 border-black m-1 border-1 xs:border-2 xxs:border-3 sm:border-4 w-95/100 sm:w-2/3">
            <div className="flex flex-col">
                <div className="text-center font-bold text-xs xs:text-sm sm:text-lg p-1 xxs:p-3 xs:p-5 sm:p-7 bg-black text-white">
                    {item.name} {item.ticker}
                </div>
                <div className="flex flex-row-reverse bg-black">
                    <div className="text-sky-500 cursor-pointer" onClick={()=>setReadMore(!readMore)}>
                        {readMore ? 'hide' : 'read more'}
                    </div>
                </div>
            </div>
            {readMore &&
            <> 
                <div className="flex flex-col bg-gray-200  xxs:p-1 sm:p-3">
                    <div className=" text-xxs xs:text-xs  sm:text-base font-bold">
                        Today's sentiment
                    </div>
                    <div className="flex flex-col">
                        <div className="flex">
                            <div>Investor's sentiment: </div>
                            <div className="font-thin">{item.investors_sentiment ?item.investors_sentiment:'-' }</div>
                        </div>
                        {item.investors_score && <div className="flex w-30/100 rounded-md">
                            <div style={{width:`${(item.investors_score+0.5) * 100}%`}} className="bg-green-600 text-center h-5 xs:h-10 rounded-l-md">
                                {(item.investors_score+0.5)*100}%
                            </div>
                            <div style={{width : `${((item.investors_score-0.5) * -1)*100}%`}} className="bg-red-600 text-center h-5 xs:h-10 rounded-r-md"> 
                                {((item.investors_score-0.5) * -1)*100}%
                            </div>
                        </div>}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex">
                            <div>Market sentiment: </div>
                            <div className="font-thin">{item.market_sentiment ?item.market_sentiment:'-' }</div>
                        </div>
                        {item.market_score && <div className="flex w-30/100 rounded-md">
                            <div style={{width:`${(item.market_score+0.5) * 100}%`}} className="bg-green-600 text-center h-5 xs:h-10 rounded-l-md">
                                {((item.market_score+0.5)*100).toFixed()}%
                            </div>
                            <div style={{width : `${((item.market_score-0.5) * -1)*100}%`}} className="bg-red-600 text-center h-5 xs:h-10 rounded-r-md"> 
                                {(((item.market_score-0.5) * -1)*100).toFixed()}%
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="flex flex-col bg-gray-100 xxs:p-1 sm:p-3">
                    <div className=" text-xxs xs:text-xs  sm:text-base font-bold">
                        Related News
                    </div>
                    <div className="flex">
                        <div className="flex flex-col justify-center">
                            <div>{item.related_news ? 'news' : '-'}</div>
                        </div>
                        <div className="flex flex-col flex-grow items-center m-1 sm:m-3">
                            {item.related_news?.map(n => <div className="flex flex-col bg-gray-200 m-1 sm:m-3 p-1 sm:p-3" key={n.title}>
                                <div className="text-center">{n.title}</div>
                                <a href={n.url} target="_blank" rel="noopener noreferrer" className="truncate text-center">read more :<img src="/icos/www.png" className="symbol inline"/></a>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-gray-200  xxs:p-1 sm:p-3">
                    <div className=" text-xxs xs:text-xs  sm:text-base font-bold">
                        Investor's reactions
                    </div>
                    {item.comments ? item.comments.map(el => <div className="flex flex-col m-1 xxs:m-2 xs:m-3 sm:m-4 bg-gray-100" key={el.userId}>
                        <div className="flex">
                            <img src="/icos/user-x.png" className="symbol"/>
                            <div className="pt-1 pl-1">User {el.userId}</div>
                        </div>
                        <div className="mt-1 pl-1">
                            {el.comment}
                        </div>

                    </div>)
                    :
                    <div>-</div>
                    }
                </div> 
            </>}
        </div>
    )
}

export default MarketSentimentItem