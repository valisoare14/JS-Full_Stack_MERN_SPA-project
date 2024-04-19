import { useEffect, useState } from 'react'
import {useSelector , useDispatch } from 'react-redux'
import {usNumberFormat} from '../../utils/usNumberFormat'
import Feedback from '../layout/Feedback'
import { getTransactions } from '../../api_s/getTransactions'
import {changeDateFormat} from '../../utils/changeDateFormat'
import { deleteTransaction } from '../../api_s/deleteTransaction'
import { setPushUpMessage , setOnNotify , setAssetToPortfolioWindow ,
     setAsset , setPortfolioAssets ,
      setPortfolioAssetsFullDetails , setPortfolioAssetDeletionDialogWindow} from '../../store/slices/slice'
import {pushNotification} from '../../api_s/pushNotification'
import AssetToPortfolioWindow from '../AssetToPortfolioWindow'
import { deletePortfolioAsset } from '../../api_s/deletePortfolioAsset'
import PortfolioAssetDeletionDialogWindow from './PortfolioAssetDeletionDialogWindow'

function FullPortfolioAssetDetails(props) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.global.token)
    const assetToPortfolioWindow = useSelector(state => state.global.assetToPortfolioWindow)
    const portfolioAssets = useSelector(state => state.global.portfolioAssets)
    const portfolioAssetsFullDetails = useSelector(state => state.global.portfolioAssetsFullDetails)
    const portfolioAssetDeletionDialogWindow = useSelector(state => state.global.portfolioAssetDeletionDialogWindow)
    const {
        asset,
        portfolioAsset ,
        unrealizedPnl,
        realizedPnl,
        loading
    } = props
    const [seeMore , setSeeMore] = useState(false)
    const [seeTransactions , setSeeTransactions] = useState(false)
    const [selectedTransaction , setSelectedTransaction] = useState(null)
    const [mostRecentTransaction , setMostRecentTransaction] = useState(null)
    const [transactions , setTransactions] = useState([])

    function calcularedUnrealisedPnl(t) {
        const price = t.price
        const quantity = t.quantity
        return t.type === 'SELL' ? 0 : asset.current_price * quantity - price * quantity
    }

    function compute24hChange(){
        const marketValue = asset.current_price * portfolioAsset.quantity
        const oldMarketValue = (asset.current_price - asset.price_change_24h) * portfolioAsset.quantity
        const change = marketValue - oldMarketValue
        const changePercentage = (((change)/(oldMarketValue != 0 ? oldMarketValue : 1))*100).toFixed(2)
        return `${change > 0 ? '+' :''}${change.toFixed(2)}$(${change > 0 ? '+' :''}${changePercentage}%)`
    }

    async function handleTransactionDeletion(t) {
        try {
            if(t._id !== mostRecentTransaction._id) {
                await pushNotification(`Only the most recent transaction can be deleted for ${asset.symbol}` , token)
                dispatch(setOnNotify(true))
                dispatch(setPushUpMessage(`Only the most recent transaction can be deleted for ${asset.symbol}`))
            } else {
                const result = await deleteTransaction(token , t._id)
                if(result.data) {
                    setTransactions(transactions.filter(tr => tr._id !== t._id))
                    dispatch(setPortfolioAssets([...portfolioAssets.filter(pa => pa._id != result.data._id),result.data]))
                    dispatch(setPortfolioAssetsFullDetails([...portfolioAssetsFullDetails.filter(paf => paf.symbol !== result.data.symbol && paf.market !== result.data.market),
                        {
                            ...portfolioAssetsFullDetails.find(pa => pa.symbol === result.data.symbol && pa.market === result.data.market),
                            transactions : [...portfolioAssetsFullDetails.find(pa => pa.symbol === result.data.symbol && pa.market === result.data.market)?.transactions.filter(tr => tr._id !=t._id)]
                        }
                    ]))
                }
                await pushNotification(result.message , token)
                dispatch(setOnNotify(true))
                dispatch(setPushUpMessage(result.message))
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        getTransactions(token , portfolioAsset._id).then(data => {
            if(data.data) {
                setTransactions(data.data)
                if(data.data.length != 0) {
                    setMostRecentTransaction(data.data[data.data.length - 1])
                }
            }
        }).catch(err => console.error(err))
    },[transactions])

    return(
        <div className="table-row">
            <div className="table-cell">
                <div className="inline-flex">
                    <img src={asset.image} alt='img' className="symbol mr-1 hidden xxs:block"/>{asset.name}
                </div>
            </div>
            {!loading?
            <div className={`table-cell ${unrealizedPnl < 0 ? 'text-red-600' : unrealizedPnl != 0 && 'text-green-600'}`}>
                {unrealizedPnl>0 ? '+' :''}{usNumberFormat(unrealizedPnl.toFixed(2))}$
            </div> : <div className="table-cell">-</div>}
            <div className={`table-cell ${realizedPnl < 0 ? 'text-red-600' : realizedPnl != 0 && 'text-green-600'}`}>
                {realizedPnl ? `${realizedPnl>0 ? '+':''}${usNumberFormat(realizedPnl.toFixed(2))}$` : <span className='text-gray-400 text-center'>-</span>}
            </div>
            <div className="table-cell">
            <img src='/icos/plus-blue.svg'
                    className="symbol w-2 xxs:w-3 sm:w-4 cursor-pointer"
                    onClick={()=>setSeeMore(!seeMore)}
                />
            </div>
            {seeMore && <>
                <div className='absolute inset-0 bg-gray-400 bg-opacity-60'></div>
                <div className='absolute inset-1/2 flex-col
                    transform -translate-x-1/2 -translate-y-1/2 
                    w-95/100 sm:w-60/100 h-1/2 xs:h-2/3 
                    text-xxxs xxs:text-xxs xs:text-xs sm:text-sm font-mono
                    bg-white overflow-auto'>
                    <div className='flex justify-end m-1'>
                        <img src={asset.image} className='symbol'/>
                        <div className='flex-grow text-xxs xxs:text-xs xs:text-sm sm:text-base text-center font-bold'>{asset.name}</div>
                        <img src='/icos/minus.png' className="symbol cursor-pointer mr-1" onClick={()=>setSeeMore(!seeMore)}/>
                    </div>
                    <div className='w-full text-center'>
                        {'24h change:  '}<span className={`${compute24hChange().substring(0,1)==="+" ? 'text-green-600' : compute24hChange().substring(0,1)==="-" && 'text-red-600'}`}>{compute24hChange()}</span>
                    </div>
                    <div className='grid grid-cols-3 m-1 xs:m-3 gap-y-4 xs:gap-y-4 sm:gap-y-4'>
                        <div className='flex-col'>
                            <div className='text-center'>Market Price</div>
                            <div className='text-center'>{usNumberFormat(asset.current_price)}$</div>
                        </div>
                        <div className='flex-col'>
                            <div className='text-center'>Unrealised PnL</div>
                            <div className={`text-center ${unrealizedPnl < 0 ? 'text-red-600' : unrealizedPnl != 0 && 'text-green-600'}`}>{unrealizedPnl>0 ? '+':''}{usNumberFormat(unrealizedPnl)}$</div>
                        </div>
                        <div className='flex-col'>
                            <div className='text-center'>Realised PnL</div>
                            <div className={`text-center ${realizedPnl < 0 ? 'text-red-600' : realizedPnl != 0 && 'text-green-600'}`}>{realizedPnl>0?'+':''}{usNumberFormat(realizedPnl)}$</div>
                        </div>
                        <div className='flex-col border-t-1'>
                            <div className='text-center'>Quantity</div>
                            <div className='text-center'>{usNumberFormat(portfolioAsset.quantity)} {asset.symbol}</div>
                        </div>
                        <div></div>
                        <div className='flex-col border-t-1'>
                            <div className='text-center'>Average Acq. Price</div>
                            <div className={`text-center ${portfolioAsset.quantity != 0 && portfolioAsset.mean_acquisition_price < asset.current_price ? 'text-green-600' : portfolioAsset.mean_acquisition_price > asset.current_price && 'text-red-600'}`}>{portfolioAsset.quantity !== 0 ? `${usNumberFormat(portfolioAsset.mean_acquisition_price)}$` : '-'}</div>
                        </div>
                        <div className='flex-col border-t-1'>
                            <div className='text-center'>Holdings value(acq.)</div>
                            <div className="text-center">{usNumberFormat((portfolioAsset.quantity * portfolioAsset.mean_acquisition_price).toFixed(2))}$</div>
                        </div>
                        <div></div>
                        <div className='flex-col border-t-1'>
                            <div className='text-center'>Holdings value(market)</div>
                            <div className="text-center">{usNumberFormat((portfolioAsset.quantity * asset.current_price).toFixed(2))}$</div>
                            <div className={`text-center ${(portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price) > 0 ?'text-green-600' : (portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price) < 0 && 'text-red-600'}`}>{(portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price)>0 ? '+':''}{(portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price).toFixed(2)}$({(portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price) > 0 ?'+':''}{(((portfolioAsset.quantity * asset.current_price - portfolioAsset.quantity * portfolioAsset.mean_acquisition_price)/(portfolioAsset.quantity * portfolioAsset.mean_acquisition_price ?portfolioAsset.quantity * portfolioAsset.mean_acquisition_price:1 ))*100).toFixed(2)}%)</div>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <Feedback asset={asset}/>
                        <div className="flex flex-col items-center gap-1 sm:gap-2  w-40/100 ">
                            <button 
                                className="bg-sky-600 rounded-md w-60/100 h-20/100 text-xxxs xs:text-xxs sm:text-xs text-white"
                                onClick={() => {
                                    dispatch(setAssetToPortfolioWindow(!assetToPortfolioWindow))
                                    dispatch(setAsset(asset))
                                }}
                            >
                                add <br/> transaction
                            </button>
                            <button
                                className="bg-red-600 rounded-md w-60/100 h-20/100 text-xxxs xs:text-xxs sm:text-xs text-white"
                                onClick={() => dispatch(setPortfolioAssetDeletionDialogWindow(!portfolioAssetDeletionDialogWindow))}
                            >
                                delete from<br/> portfolio
                            </button>
                        </div>
                    </div>
                    <div className='text-xxs xxs:text-xs xs:text-sm sm:text-base font-bold border-t-1  flex justify-between mt-1 mb-1 xs:mt-3 pt-1 pb-1'>
                            <>&nbsp;&nbsp;Transactions History</> 
                            <img src={`/icos/${seeTransactions ? 'minus.png' : 'plus-blue.svg'}`} className='symbol pr-1 cursor-pointer'
                                onClick={()=>setSeeTransactions(!seeTransactions)}/>
                    </div>
                    {seeTransactions && <div className='w-full flex flex-col'>
                        <div className='flex-col w-full p-1'>
                            <div className='flex justify-around'>
                                <div className='w-10/100 font-bold'>type</div>
                                <div className='w-15/100 font-bold'>quantity</div>
                                <div className='w-15/100 font-bold'>price</div>
                                <div className='font-bold'>date</div>
                                <div className='w-10/100'></div>
                            </div>
                        </div>
                        {transactions.length!=0 && transactions.reverse().map(t =>{
                        let unrealisedPnl = calcularedUnrealisedPnl(t)

                        return <div className={`flex flex-col w-full p-1 ${selectedTransaction === t._id && 'bg-gray-200'}`} key={t._id}>
                                <div className='flex justify-around'>
                                    <div className={`${t.type === 'BUY' ? 'text-green-600' : 'text-red-600'} w-10/100`}>{t.type}</div>
                                    <div className='w-15/100'>{usNumberFormat(t.quantity)}{asset.symbol}</div>
                                    <div className='w-15/100'>{usNumberFormat(t.price)}$</div>
                                    <div className='hidden xxs:block'>{changeDateFormat(t.date)}</div>
                                    <div className='block xxs:hidden'>{changeDateFormat(t.date).substring(0,10)}</div>
                                    <img src='/icos/info-circle-blue.svg' className='symbol cursor-pointer w-10/100'
                                        onClick={()=>setSelectedTransaction(selectedTransaction === t._id ? null : t._id )}/>
                                </div>  
                                {selectedTransaction && selectedTransaction === t._id && 
                                <div className='grid grid-cols-3 gap-2 sm:gap-4 mt-1 mb-1 xs:mt-3 xs:mb-3'>
                                    <div className='flex-col bg-white rounded-md'>
                                        <div className='text-center'>value</div>
                                        <div className='text-center'>{(usNumberFormat(t.quantity*t.price))}$</div>
                                    </div>
                                    <div className='flex-col bg-white rounded-md'>
                                        <div className='text-center'>fee</div>
                                        <div className='text-center'>{t.fee}$</div>
                                    </div>
                                    <div className='flex-col bg-white rounded-md'>
                                        <div className='text-center'>realised PnL</div>
                                        <div className={`text-center ${t.realized_profit < 0 ? 'text-red-600' : t.realized_profit != 0 && 'text-green-600'}`}>{t.realized_profit > 0 ? '+' :''}{t.realized_profit.toFixed(2)}$</div>
                                    </div>
                                    <div className='flex-col bg-white rounded-md'>
                                        <div className='text-center'>unrealised PnL</div>
                                        <div className={`text-center ${unrealisedPnl < 0 ? 'text-red-600' : unrealisedPnl != 0 && 'text-green-600'}`}>{unrealisedPnl > 0 ?'+':''}{unrealisedPnl.toFixed(2)}$</div>
                                    </div>
                                    <div></div>
                                    <button 
                                        className='relative border rounded-md text-black text-center border-black 
                                            bg-red-400 h-4 xxs:h-auto w-10 xxs:w-15 justify-self-center'
                                        onClick={async ()=>await handleTransactionDeletion(t)}>
                                        DELETE
                                        {t._id != mostRecentTransaction._id && 
                                            <div className='absolute inset-0 bg-gray-100 bg-opacity-60 rounded-md border'></div>
                                        }
                                    </button>
                                </div>
                                }
                        </div>
                        })}
                    </div>}
                </div>
            </>}
            {assetToPortfolioWindow &&
                <> 
                    <div className='absolute inset-0 bg-gray-400 bg-opacity-15'></div>
                    <AssetToPortfolioWindow fromPortfolio={true}/>
                </>
            }
            {portfolioAssetDeletionDialogWindow &&
                <>
                    <div className='absolute inset-0 bg-gray-400 bg-opacity-60'></div>
                    <PortfolioAssetDeletionDialogWindow portfolioAsset={{...portfolioAsset,name:asset.name}}/>
                </>
            }
        </div>
    )
}

export default FullPortfolioAssetDetails