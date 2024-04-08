import {useEffect, useState} from 'react'
import { fetchMarketSentiment } from '../api_s/fetchMarketSentiment'
import {useSelector} from 'react-redux'
import MarketSentimentItem from './MarketSentimentItem'
import MarketsButton from './layout/MarketsButton'

function MarketSentiment() {
    const token = useSelector(state => state.global.token)
    const collection = useSelector(state => state.global.collection)
    const [data , setData] = useState([])
    const [filteredData , setFilteredData] = useState([])
    useEffect(()=>{
        fetchMarketSentiment(token).
        then(data => {
            setData(data)
            setFilteredData(data.filter(el => el.market === collection))
        }).
        catch(err => console.error(err))
    },[])

    useEffect(()=>{
        setFilteredData(data.filter(el => el.market === collection))
    },[collection])
    return(
        <>
            <MarketsButton/>
            {filteredData.length != 0 ?
            filteredData.map(el => <MarketSentimentItem item={el} key={el.ticker}/>)
            :
            <div className='flex flex-col items-center justify-center font-mono h-65vh text-xxxs xxs:text-xxs xs:text-xs sm:text-sm'>
                <div>The market has no sentiment related to {collection} for today {':))'} </div>
                <div>Please check again later ! </div>
            </div>    
            }
        </>
    )
}

export default MarketSentiment