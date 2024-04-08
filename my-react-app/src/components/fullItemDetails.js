import { useSelector , useDispatch } from "react-redux"
import { setAssetDetails } from "../store/slices/slice"
import {changeDateFormat} from'../utils/changeDateFormat'
import Feedback from "./layout/Feedback"

function FullItemDetails() {
    const dispatch = useDispatch()
    const assetDetails = useSelector(state => state.global.assetDetails)
    const asset = useSelector(state => state.global.asset)
    const collection = useSelector(state => state.global.collection)
    const token = useSelector(state=> state.global.token)

    function changeFormat(value) {
        if(value) {
            if(collection == 'stocks') {
                if(value.toFixed().toString().length >= 1 && value.toFixed().toString().length < 4) {
                    return `${value.toFixed(2)} mil.`
                }
                if(value.toFixed().toString().length >= 4 && value.toFixed().toString().length < 7) {
                    return `${(value.toFixed()/1000).toFixed(2)} bil.`
                }
                if(value.toFixed().toString().length >= 7) {
                    return `${(value.toFixed()/1000000).toFixed(2)} tril.`
                }
            } else if (collection == 'cryptocurrencies') {
                if(value.toFixed().toString().length >= 7 && value.toFixed().toString().length < 10) {
                    return `${(value.toFixed()/1000000).toFixed(2)} mil.`
                }
                if(value.toFixed().toString().length >= 10 && value.toFixed().toString().length < 13) {
                    return `${(value.toFixed()/1000000000).toFixed(2)} bil.`
                }
                if(value.toFixed().toString().length >= 13 && value.toFixed().toString().length < 16) {
                    return `${(value.toFixed()/1000000000000).toFixed(2)} tril.`
                }
            }
        } else {
            return value
        }
    }

    return(
        <div className="fixed w-screen h-screen inset-0 bg-gray-400 bg-opacity-80">
            <div className="absolute flex-col w-4/5 xxs:w-3/5 h-2/5 sm:h-3/5 inset-1/2 
                transform -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-md font-mono text-xxs sm:text-sm overflow-auto">
                <div className="flex justify-end">
                    <div className="justify-self-start">rank: #{asset.market_cap_rank}</div>
                    <p className="w-full text-center text-sm sm:text-lg">{asset.name}</p>
                    <img src='/icos/x.svg' className="symbol justify-self-end xxs:p-1 m-1 bg-opacity-0 cursor-pointer" onClick={()=>dispatch(setAssetDetails(!assetDetails))}/>
                </div>
                <div className="grid grid-cols-3 gap-1">
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Market Cap</div>
                        <div>{asset.market_cap ? `$ ${changeFormat(asset.market_cap)}`:'-'}</div>
                    </div>
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Supply</div>
                        <div>
                            {asset.supply ? `${changeFormat(asset.supply)} ${collection != 'cryptocurrencies' ? 'assets':'tokens'}`:'-'}
                            </div>
                    </div>
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Day's high</div>
                        <div>$ {asset.dayHigh}</div>
                    </div>
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Day's low</div>
                        <div>$ {asset.dayLow}</div>
                    </div>
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Price change</div>
                        <div className={`${asset.price_change_24h >=0 ? 'text-green-600' : 'text-red-600'}`}>$ {asset.price_change_24h?.toFixed(3)}</div>
                    </div>
                    <div className="flex-col text-center">
                        <div className="text-xs sm:text-base">Previous day close</div>
                        <div>$ {asset.previous_close?.toFixed(3)}</div>
                    </div>
                </div>
                {token && 
                <div className="flex items-center w-full">
                    <Feedback asset={asset}/>
                    <div className="flex justify-center w-40/100 ">
                        <button className="bg-sky-600 rounded-md w-full xxs:w-75/100 sm:w-50/100 text-xxxs xs:text-xxs sm:text-xs">
                            add to portfolio
                        </button>
                    </div>
                    
                </div>
                
                }
                {collection == 'stocks' &&
                <ul className="overflow-auto m-1 sm:m-3">
                    <li className="sm:mt-1 sm:mb-1">Country: {asset.country}</li>
                    <li className="sm:mt-1 sm:mb-1">Exchange: {asset.exchange}</li>
                    <li className="sm:mt-1 sm:mb-1">Industry: {asset.industry}</li>
                    <li className="sm:mt-1 sm:mb-1">IPO: {asset.ipo}</li>
                    <li className="inline-flex sm:mt-1 sm:mb-1">Website: 
                    <a href={asset.website} target="_blank" rel="noopener noreferrer" className="truncate"><img src="/icos/www.svg" className="symbol"/></a>
                    </li>
                </ul>
                }
                {collection == 'cryptocurrencies' &&
                <ul className="overflow-auto m-1 sm:m-3">
                    <li className="sm:mt-1 sm:mb-1">Fully diluted valuation: $ {changeFormat(asset.fully_diluted_valuation)}</li>
                    <li className="sm:mt-1 sm:mb-1">Daily volume: $ {changeFormat(asset.total_volume)}</li>
                    <li className="sm:mt-1 sm:mb-1 flex">
                        M.k. change 24h: <p className={`${asset.market_cap_change_24h>=0?'text-green-600':'text-red-600'}`}>$ {changeFormat(asset.market_cap_change_24h)}</p>
                    </li>
                    <li className="sm:mt-1 sm:mb-1 inline-flex">
                        M.k. change% 24h: <p className={`${asset.market_cap_change_percentage_24h>=0?'text-green-600':'text-red-600'}`}>{asset.market_cap_change_percentage_24h?.toFixed(2)} %</p>
                    </li>
                    <li className="sm:mt-1 sm:mb-1">Circulating supply: {changeFormat(asset.circulating_supply)} tokens</li>
                    <li className="sm:mt-1 sm:mb-1">Max supply: {changeFormat(asset.max_supply)} tokens</li>
                    <li className="sm:mt-1 sm:mb-1">ATH: $ {asset.ath}</li>
                    <li className="sm:mt-1 sm:mb-1">ATH change%: {asset.ath_change_percentage} %</li>
                    <li className="sm:mt-1 sm:mb-1">ATH date: {changeDateFormat(asset.ath_date)}</li>
                    <li className="sm:mt-1 sm:mb-1">ATL: $ {asset.atl}</li>
                    <li className="sm:mt-1 sm:mb-1">ATL change%: {asset.atl_change_percentage} %</li>
                    <li className="sm:mt-1 sm:mb-1">ATL date: {changeDateFormat(asset.atl_date)}</li>
                </ul>
                }
                {collection == 'commodities' &&
                <ul className="overflow-auto m-1 sm:m-3">
                    <li className="sm:mt-1 sm:mb-1">Year's high: $ {asset.year_high}</li>
                    <li className="sm:mt-1 sm:mb-1">Year's low: $ {asset.year_low}</li>
                    <li className="sm:mt-1 sm:mb-1">50 days average price: $ {asset.average_price_50_days}</li>
                    <li className="sm:mt-1 sm:mb-1">200 days average price: $ {asset.average_price_200_days}</li>
                    <li className="sm:mt-1 sm:mb-1">Exchange: {asset.exchange}</li>
                    <li className={`sm:mt-1 sm:mb-1 inline-flex`}>Daily volume:  <p className={`${asset.volume > asset.average_volume ? 'text-green-600' :'text-red-600'}`}>{asset.volume} contracts</p> </li>
                    <li className="sm:mt-1 sm:mb-1">Average volume: {asset.average_volume} contracts</li>
                </ul>
                }
            </div>
        </div>
    )
}
export default FullItemDetails