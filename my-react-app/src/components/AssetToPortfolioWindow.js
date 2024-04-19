import { useSelector , useDispatch } from "react-redux"
import { setAssetToPortfolioWindow, setPortfolios , setSelectedPortfolio } from "../store/slices/slice"
import { useEffect , useState } from "react"
import { getPortfolioAssetsByPortfolioId } from "../api_s/getPortfolioAssetsByPortfolioId"
import {addPortfolioAsset} from "../api_s/addPortfolioAsset"
import { pushNotification } from "../api_s/pushNotification"
import { setOnNotify , setPushUpMessage , setPortfolioAssets , setPortfolioAssetsFullDetails} from "../store/slices/slice"
import {addTransaction} from "../api_s/addTransaction"

function AssetToPortfolioWindow({fromPortfolio}){
    const dispatch = useDispatch()
    const assetToPortfolioWindow = useSelector(state => state.global.assetToPortfolioWindow)
    const asset = useSelector(state => state.global.asset)
    const token = useSelector(state => state.global.token)
    const portfolios = useSelector(state => state.global.portfolios)
    const selectedPortfolio = useSelector(state => state.global.selectedPortfolio)
    const portfolioAssets = useSelector(state => state.global.portfolioAssets)
    const portfolioAssetsFullDetails = useSelector(state => state.global.portfolioAssetsFullDetails)
    const [transactionType , setTransactionType] = useState('BUY')
    const [sellBtnDisabled , setSellBtnDisabled] = useState(false)
    const [portfolioAsset , setPortfolioAsset] = useState(null)
    const [quantity , setQuantity] = useState(null)
    const [price , setPrice] = useState(null)
    const [fee , setFee] = useState(0)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if(!portfolioAsset) {
                addPortfolioAsset(token , selectedPortfolio._id , asset.symbol , 
                    asset.market , quantity , price , fee).
                then(async data => {
                    if(data.data) {
                        setPortfolioAsset(data.data.portfolioasset)
                    }
                    await pushNotification(data.message , token)
                    dispatch(setOnNotify(true))
                    dispatch(setPushUpMessage(data.message))
                }).catch(err => console.error(err))
            } else {
                addTransaction(token , portfolioAsset._id , quantity , price , fee , transactionType).
                then(async data => {
                    if(data.data) {
                        setPortfolioAsset(data.data.portfolioasset)
                        if(fromPortfolio) {
                            dispatch(setPortfolioAssets([...portfolioAssets.
                                filter(pa => pa._id !== data.data.portfolioasset._id ),
                                data.data.portfolioasset]))
                            const npfa = portfolioAssetsFullDetails.
                            find(pfa => pfa.symbol === data.data.portfolioasset.symbol && pfa.market === data.data.portfolioasset.market)
                            dispatch(setPortfolioAssetsFullDetails([...portfolioAssetsFullDetails.
                                filter(pfa => pfa.symbol !== data.data.portfolioasset.symbol && pfa.market !== data.data.portfolioasset.market),
                                {...npfa , transactions : [...npfa.transactions , data.data.transaction]}
                            ]))
                        }
                    }
                    await pushNotification(data.message , token)
                    dispatch(setOnNotify(true))
                    dispatch(setPushUpMessage(data.message))
                }).catch(err => console.error(err))
            }
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(()=>{
        if(!selectedPortfolio) {
            dispatch(setSelectedPortfolio(portfolios[0]))
        }
        getPortfolioAssetsByPortfolioId(token , portfolios[0]._id).then(data=>{
            if(!data.map(el => el.symbol).includes(asset.symbol)) {
                setSellBtnDisabled(true)
            } else{
                const pa =data.find(el => el.symbol === asset.symbol)
                setPortfolioAsset(pa)
                if(pa.quantity == 0 ){
                    setSellBtnDisabled(true)
                }
            }
        })
    },[])

    useEffect(()=>{
        if(portfolioAsset) {
            if(portfolioAsset.quantity == 0) {
                setSellBtnDisabled(true)
                setTransactionType('BUY')
            } else {
                setSellBtnDisabled(false)
            }
        }   
    },[portfolioAsset])

    useEffect(()=>{
        if(selectedPortfolio) {
            getPortfolioAssetsByPortfolioId(token , selectedPortfolio._id).then(data=>{
                if(!data.map(el => el.symbol).includes(asset.symbol)) {
                    setPortfolioAsset(null)
                    setSellBtnDisabled(true)
                } else{
                    const pa =data.find(el => el.symbol === asset.symbol)
                    setPortfolioAsset(pa)
                    if(pa.quantity == 0 ){
                        setSellBtnDisabled(true)
                    }
                }
            })
        }
    },[selectedPortfolio])

    return(
        <div className="absolute inset-1/2 flex-col items-center w-4/5 xxs:w-3/5  h-45/100 sm:h-65/100 overflow-hidden
            transform -translate-x-1/2 -translate-y-1/2 
            bg-white font-mono text-xxs sm:text-sm">
                <div className="flex">
                    <img src='/icos/leftstraightarrow.svg' className="symbol xxs:p-1 m-1 cursor-pointer" 
                        onClick={()=>dispatch(setAssetToPortfolioWindow(!assetToPortfolioWindow))}/>
                    <div className="flex-grow text-center text-xs xs:text-sm sm:text-lg">{asset.name}</div>
                </div>
                <div className="flex flex-col xxs:flex-row justify-between">
                    <div className="flex">
                        <div className="pl-1">
                            {selectedPortfolio ? 'portfolio: ' : 'select portfolio: '}
                        </div>
                        {selectedPortfolio ? 
                        <div className={`text-green-600 pl-1 font-bold ${!fromPortfolio && 'cursor-pointer'}`} onClick={()=>{
                            if(portfolios.length !=1 && !fromPortfolio) {
                                const a = portfolios.filter(p => p.name !== selectedPortfolio.name)
                                const b = [selectedPortfolio]
                                dispatch(setPortfolios(b.concat(a)))
                                dispatch(setSelectedPortfolio(null))
                                setTransactionType("BUY")
                            }
                            }}>
                            {selectedPortfolio.name}
                        </div> 
                        :
                        <select className="focus:outline-none text-green-600 xxs:pl-1 font-bold"
                            onChange={e => dispatch(setSelectedPortfolio(portfolios.find(p => p.name === e.target.value)))}
                            value={ selectedPortfolio ? selectedPortfolio : portfolios[0]}>
                            {portfolios.map(p => <option key={p.name} >
                            {p.name}
                            </option>)}
                        </select>
                        }
                    </div>
                    <div className="pl-1 pr-1 text-end">
                        {selectedPortfolio &&<> <span className="font-bold">{`${asset.symbol}`}</span>{` is ${portfolioAsset ? 'allready' : "not"} in ${selectedPortfolio.name} portfolio !`}</>}
                    </div>
                </div>
                <div className="relative flex ml-1 mr-1 mt-1">
                    <div className={`cursor-pointer flex-grow text-center text-xs xs:text-sm sm:text-lg text-green-800 bg-green-100 mr-1 ${transactionType ==='SELL' && 'mb-1'}`} onClick={()=>setTransactionType('BUY')}>BUY</div>
                    <div className={`relative cursor-pointer flex-grow text-center text-xs xs:text-sm sm:text-lg text-red-800 bg-red-100 ml-1 ${transactionType ==='BUY' && 'mb-1'}`} onClick={()=>{
                        {!sellBtnDisabled && setTransactionType('SELL')}
                    }}>
                        SELL
                        {selectedPortfolio && sellBtnDisabled && <div className="absolute base-0 left-1/2 transform -translate-x-1/2 text-red-600 text-xxxs z-10 w-full pt-1">
                            {`${!portfolioAsset ? `please buy some ${asset.symbol} first` : 'not enought quantity to sell'}`}
                        </div>}
                    </div>
                    {!selectedPortfolio && <div className="absolute inset-0 bg-gray-400 bg-opacity-50">

                    </div>}
                </div> 
                <form className={`relative flex flex-col items-center justify-center ml-1 mr-1 ${transactionType === "SELL" ? 'bg-red-100' : 'bg-green-100'} h-65/100 sm:h-70/100`}
                    onSubmit={handleSubmit}>
                    <div className="flex w-full justify-end pr-1 xs:pr-3">
                        <div className="flex flex-col md:mb-2">
                            <div >current price : {asset.current_price}$</div>
                            {portfolioAsset && portfolioAsset.quantity!=0 && <div className="text-sky-600">mean portfolio price: {portfolioAsset.mean_acquisition_price.toFixed(2)}$</div>}
                            {portfolioAsset && transactionType==="SELL" && <div className="text-sky-600">holdings: {portfolioAsset.quantity.toFixed(3)} {portfolioAsset.symbol}</div>}
                        </div>
                    </div>
                    <div className="flex flex-col xxs:flex-row w-full justify-between pl-1 pr-1 sm:pl-10 sm:pr-10 xxs:mt-1 xxs:mb-1">
                        <div >quantity:</div>
                        <div>
                            {transactionType === "SELL"  && <button type="button" className="text-sky-600 pr-1 pl-1" onClick={()=> setQuantity(portfolioAsset.quantity)}>
                                use max
                            </button>}
                            <input type="number" className="focus:outline-none h-4 xs:h-6 w-auto sm:w-40 border border-black pl-1" min={0.001} required placeholder="quantity" value={quantity} step={0.001}
                                onChange={(e)=> setQuantity(e.target.value)}/>
                        </div>
                        
                    </div>
                    <div className="flex flex-col xxs:flex-row w-full justify-between pl-1 pr-1 sm:pl-10 sm:pr-10 xxs:mt-1 xxs:mb-1">
                        <div>price:</div>
                        <div>
                            <button type="button" className="text-sky-600 pr-1 pl-1" onClick={()=> setPrice(asset.current_price)}>
                                current
                            </button>
                            <input type="number" className="focus:outline-none h-4 xs:h-6 w-auto sm:w-40 border border-black pl-1" min={0.01} required placeholder="price" value={price} step={0.01}
                                onChange={(e)=> setPrice(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex flex-col xxs:flex-row w-full justify-between pl-1 pr-1 sm:pl-10 sm:pr-10 xxs:mt-1 xxs:mb-1">
                        <div>fee:</div>
                        <input type="number" className="focus:outline-none h-4 xs:h-6 w-auto sm:w-40 border border-black pl-1"  placeholder="fee" step={0.01}
                            onChange={(e)=> setFee(e.target.value)}/>
                    </div>
                    <button type="submit" className={`border ${transactionType === "BUY" ? 'bg-green-600':'bg-red-600'} rounded-sm p-1 xs:p-2 sm:p-3 text-white mt-1 sm:mt-4`}>
                        submit transaction
                    </button>
                    {!selectedPortfolio && <div className="absolute flex items-center justify-center inset-0 bg-gray-400 bg-opacity-50">
                        <div className="text-white text-sm sm:text-lg">
                            Please select a portolio to unlock!
                        </div>
                    </div>}
                </form>
        </div>
    )
}

export default AssetToPortfolioWindow