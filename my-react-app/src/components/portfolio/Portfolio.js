import PortfolioManager from "./PortfolioManager"
import {useEffect, useState } from 'react'
import {useSelector , useDispatch } from 'react-redux'
import { getPortfolioAssetsByPortfolioId } from "../../api_s/getPortfolioAssetsByPortfolioId"
import { getAssetDetailsBySymbol } from "../../api_s/getAssetDetailsBySymbol"
import { setSelectedPortfolio , setPortfolioAssets  , setPortfolioAssetsFullDetails} from "../../store/slices/slice"
import { Link } from 'react-router-dom'
import { getTransactionsByPortfolioAssetId } from "../../api_s/getTransactionsByPortfolioAssetId"
import FullPortfolioAssetDetails from "./FullPortfolioAssetDetails"
import PortfolioAssetsDistributionPieChart from "./PortfolioAssetsDistributionPieChart"

function Portfolio(){
    const dispatch = useDispatch()
    const selectedPortfolio = useSelector(state => state.global.selectedPortfolio)
    const portfolios = useSelector(state => state.global.portfolios)
    const token = useSelector(state => state.global.token)
    const portfolioAssets = useSelector(state => state.global.portfolioAssets)
    const portfolioAssetsFullDetails = useSelector(state => state.global.portfolioAssetsFullDetails)
    const [loading , setLoading] = useState(false)
    const [portfolioPerformance , setPortfolioPerformance] = useState(null)
    const [piechart , setPieChart] = useState(false)

    function calculateUnrealizedPnl(fullAssetDetails) {
        const portfolioAsset = portfolioAssets.find(a => a.symbol === fullAssetDetails.symbol && a.market === fullAssetDetails.market)
        return portfolioAsset.quantity * (fullAssetDetails.current_price - portfolioAsset.mean_acquisition_price)
    }

    function calculateRealizedPnl(transactions) {
        if(transactions.length != 0) {
            return transactions.reduce((s,t) => s+=t.realized_profit , 0) 
        } else {
            return null
        }
    }

    async function fetchTransactions(a) {
        try {
            const response = await getTransactionsByPortfolioAssetId(token , a._id)
            return {
                symbol : a.symbol,
                market : a.market,
                transactions : response.data
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchFullPortfolioAssetDetails(filteredSymbolsByMarket , market){
        try {
            const response = await getAssetDetailsBySymbol(filteredSymbolsByMarket.map(el => el.symbol) , market)
            const promises = filteredSymbolsByMarket.map(el => fetchTransactions(el))
            const result = await Promise.all(promises)


            return response.map(detail =>({
                ...detail ,
                transactions : result.find(tr => tr.symbol === detail.symbol && tr.market === detail.market)?.transactions || []
            }))
        } catch (error) {
            console.error(error)
        }
    }

    function computePortfolioPerformance() {
        if(portfolioAssetsFullDetails.length != 0) {
            const factor =  portfolioAssetsFullDetails.map(el => ({
                _id : el._id,
                quantity : portfolioAssets.find(pa => pa.symbol ===el.symbol && pa.market === el.market)?.quantity,
                old_price : el.current_price - el.price_change_24h,
                current_price : el.current_price
            }))

            const market_value = factor.reduce((s , e) => s+= e.quantity * e.current_price , 0 ).toFixed(2)
            const old_value = factor.reduce((s , e) => s+= e.quantity * e.old_price , 0 )
            const change_24h = (market_value - old_value).toFixed(2)
            const change_percentage_24h = (((market_value - old_value) / old_value) * 100).toFixed(2)

            const initial_investment = portfolioAssetsFullDetails.
                map(el => el.transactions).reduce((s,e) =>s.concat(e) , []).
                filter(t => t.type === 'BUY').
                reduce((s,t) => s+=t.price * t.quantity , 0).
                toFixed(2)

            const holdings_value = portfolioAssets.reduce((s,pa) => s+=pa.quantity * pa.mean_acquisition_price,0).
                toFixed(2)
            const realized_profit = portfolioAssetsFullDetails.
                map(el => el.transactions).reduce((s,e) =>s.concat(e) , []).
                reduce((s,t) => s+=t.realized_profit , 0).
                toFixed(2)       
            const fees = portfolioAssetsFullDetails.
                map(el => el.transactions).reduce((s,e) =>s.concat(e) , []).
                reduce((s,t) => s+= (t.fee?t.fee:0) , 0).
                toFixed(2)                                                   
            
            return {
                "change" : `${change_24h > 0 ? '+' :''}${change_24h}$(${change_24h > 0 ? '+' : ''}${change_percentage_24h}%)`,
                "market_value" : market_value,
                "initial_investment" : initial_investment,
                "holdings_value" : holdings_value,
                "realized_pnl" : realized_profit,
                "unrealized_pnl" : (market_value - holdings_value).toFixed(2),
                "fees" : fees
            }
        } else {
            return null
        }
    }

    useEffect(()=>{
        if(selectedPortfolio) {
            setLoading(true)
            getPortfolioAssetsByPortfolioId(token , selectedPortfolio._id).then(data=>{
                dispatch(setPortfolioAssets(data))
                if(data.length != 0) {
                    setPieChart(true)
                    var promises = []
                    for(let market of ['stocks','cryptocurrencies','commodities']){
                        const filteredSymbolsByMarket = data.filter(el => el.market == market)
                        if(filteredSymbolsByMarket.length != 0) {
                            promises.push(fetchFullPortfolioAssetDetails(filteredSymbolsByMarket , market))
                        }
                    }
                    Promise.all(promises).then(results => {
                        const fullAssetsDetails = results.flat()
                        if(fullAssetsDetails.length != 0) {
                            dispatch(setPortfolioAssetsFullDetails(fullAssetsDetails))
                        }
                        
                        setLoading(false)
                    }).catch(err => console.error(err))
                } else{
                    setPieChart(false)
                }
            }).catch(err => console.error(err))
        } else {
            dispatch(setPortfolioAssets([]))
            dispatch(setPortfolioAssetsFullDetails([]))
        }
    },[selectedPortfolio])

    useEffect(()=>{
        dispatch(setSelectedPortfolio(null))
        dispatch(setPortfolioAssets([]))
        setPieChart(false)
    },[portfolios])

    useEffect(()=>{
        if(portfolioAssetsFullDetails.length != 0 && portfolioAssets.length!= 0) {
            setPieChart(true)
            setPortfolioPerformance(computePortfolioPerformance())
        } else{
            setPieChart(false)
        }
    },[portfolioAssetsFullDetails , portfolioAssets])


    return(
        <div className="relative flex flex-col text-xxxs xxs:text-xxs xs:text-xs sm:text-sm font-mono w-full">
            <PortfolioManager/>
            {portfolioAssets.length == 0 ?
                <div className="text-center">
                    {selectedPortfolio ? 
                    <>
                        <div>no assets into this portfolio</div>
                        <Link to='/'>
                            <button className='border rounded-xl p-2 bg-white hover:bg-gray-400 m-2'>
                                Add assets
                            </button>
                        </Link>
                    </> 
                    : 
                    'please select a portfolio'}
                </div>
            :
                <>
                    {selectedPortfolio &&
                    <div className="flex flex-col p-4 border-t-2">
                        {portfolioPerformance &&
                        <div className="flex-col w-full border-b-2 items-center">
                            <div className="text-center text-xs xxs:sm xs:text-base sm:text-lg font-bold">{selectedPortfolio.name}</div>
                            <div className="flex justify-center gap-8">
                                <div className="text-center">24h change:</div>
                                <div className={`text-center ${portfolioPerformance.change.substring(0,1) === '+' ? 'text-green-600' : portfolioPerformance.change.substring(0,1) === '-' && 'text-red-600'}`}>{portfolioPerformance.change}</div>
                            </div>
                            <div className="text-xs xxs:sm xs:text-base sm:text-lg font-bold mt-4">Portfolio performance</div>
                            <div className="flex flex-col mt-1 mb-4">
                                <div className="flex justify-around border-b-1">
                                    <div className="w-1/2">Holdings value{'(acq.)'}</div>
                                    <div className="w-1/2 text-end">{portfolioPerformance.holdings_value}$</div>
                                </div>
                                <div className="flex justify-around border-b-1">
                                    <div className="w-1/2">Holdings value{'(market)'}</div>
                                    <div className={`hidden xxs:block ${portfolioPerformance.market_value-portfolioPerformance.holdings_value > 0 ? 'text-green-600' : portfolioPerformance.market_value-portfolioPerformance.holdings_value!=0 && 'text-red-600'}`}>
                                            {`${portfolioPerformance.market_value-portfolioPerformance.holdings_value>0?'+':''}${(portfolioPerformance.market_value-portfolioPerformance.holdings_value).toFixed(2)}$(${portfolioPerformance.market_value-portfolioPerformance.holdings_value>0?'+':''}${(((portfolioPerformance.market_value-portfolioPerformance.holdings_value)/portfolioPerformance.holdings_value)*100).toFixed(2)}%)`}
                                    </div>
                                    <div className="w-1/2 text-end xxs:flex-col">
                                        <div>{portfolioPerformance.market_value}$</div>
                                        <div className={`block xxs:hidden ${portfolioPerformance.market_value-portfolioPerformance.holdings_value > 0 ? 'text-green-600' : portfolioPerformance.market_value-portfolioPerformance.holdings_value!=0 && 'text-red-600'}`}>
                                            {`${portfolioPerformance.market_value-portfolioPerformance.holdings_value>0?'+':''}${(portfolioPerformance.market_value-portfolioPerformance.holdings_value).toFixed(2)}$(${portfolioPerformance.market_value-portfolioPerformance.holdings_value>0?'+':''}${(((portfolioPerformance.market_value-portfolioPerformance.holdings_value)/portfolioPerformance.holdings_value)*100).toFixed(2)}%)`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-around border-b-1">
                                    <div className="w-1/2">Total fees</div>
                                    <div className="w-1/2 text-end">{portfolioPerformance.fees}$</div>
                                </div>
                                <div className="flex justify-around border-b-1">
                                    <div className="w-1/2">Initial Investment</div>
                                    <div className="w-1/2 text-end">{portfolioPerformance.initial_investment}$</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col">
                                    <div className="text-center">Realised Pnl</div>
                                    <div className={`text-center ${portfolioPerformance.realized_pnl > 0 ? 'text-green-600' : portfolioPerformance.realized_pnl < 0 && 'text-red-600'}`}>{portfolioPerformance.realized_pnl > 0 && '+'}{portfolioPerformance.realized_pnl}$</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-center">Unrealised PnL</div>
                                    <div className={`text-center ${portfolioPerformance.unrealized_pnl > 0 ? 'text-green-600' : portfolioPerformance.unrealized_pnl < 0 && 'text-red-600'}`}>{portfolioPerformance.unrealized_pnl > 0 && '+'}{portfolioPerformance.unrealized_pnl}$</div>
                                </div>
                            </div>
                            {piechart && !loading &&
                                <PortfolioAssetsDistributionPieChart key={selectedPortfolio._id} portfolioAssets={portfolioAssets.map(pa => ({
                                    _id : pa._id,
                                    symbol : pa.symbol,
                                    quantity : pa.quantity,
                                    name : portfolioAssetsFullDetails.find(pfa => pfa.symbol === pa.symbol && pfa.market === pa.market)?.name,
                                    current_price : portfolioAssetsFullDetails.find(pfa => pfa.symbol === pa.symbol && pfa.market === pa.market)?.current_price
                                }))}/>
                            }
                        </div>
                        }
                        <div className="text-xs xxs:sm xs:text-base sm:text-lg font-bold">
                            My assets
                        </div>
                        <div className="table">
                            <div className="table-header-group">
                                <div className="table-row">
                                    <div className="table-cell">
                                        
                                    </div>
                                    <div className="table-cell">
                                        Unrealised PnL
                                    </div>
                                    <div className="table-cell">
                                        Realised PnL
                                    </div>
                                </div>
                            </div>
                            <div className="table-row-group">
                                {!loading && portfolioAssetsFullDetails.length != 0 && portfolioAssetsFullDetails.map(a =>{
                                    const unrealizedPnl = calculateUnrealizedPnl(a)
                                    const realizedPnl = calculateRealizedPnl(a.transactions)
                                    
                                    return (
                                        <FullPortfolioAssetDetails asset={a} 
                                            portfolioAsset={portfolioAssets.find(el => el.symbol === a.symbol && el.market === a.market)} 
                                            unrealizedPnl={unrealizedPnl} 
                                            realizedPnl={realizedPnl} loading={loading} key={a._id}/>
                                    )
                                    })
                                }
                            </div>
                        </div>
                    </div>}
                </>
            }
        </div> 
    )
}

export default Portfolio