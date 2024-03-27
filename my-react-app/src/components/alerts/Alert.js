import { useEffect, useState , Fragment } from "react"
import {fetchServer} from '../../api_s/fetchServer'
import Spinner from '../layout/Spinner'
import { postAlert } from "../../api_s/postAlert"
import { useSelector , useDispatch } from "react-redux"
import { setAlertHistoryUpdate } from "../../store/slices/slice"

function Alert() {
    const [collection , setCollection] = useState('stocks')
    const [assets , setAssets] = useState([])
    const [filteredAssets , setFilteredAssets] = useState([])
    const [choosedAsset , setChoosedAsset] = useState(null)
    const [loading , setLoading] = useState(false)
    const [btnDisabled , setBtnDisabled] = useState(true)
    const [targetPrice , setTargetPrice] = useState(null)


    const token = useSelector(state => state.global.token)
    const menu = useSelector(state => state.global.menu)
    const alertHistoryUpdate = useSelector(state => state.global.alertHistoryUpdate)
    const dispatch = useDispatch()

    function filterResult(searchedString) {
        setFilteredAssets(
            assets.filter(el => `${el.name.toLowerCase()}${el.symbol.toLowerCase()}`.includes(searchedString))
        )
    }

    async function handleAlertSubmit() {
        await postAlert(choosedAsset , targetPrice , token)
        setChoosedAsset(null)
        setTargetPrice('')
        dispatch(setAlertHistoryUpdate(!alertHistoryUpdate))
    }

    useEffect(()=>{
        if(!choosedAsset) {
            setBtnDisabled(true)
        }
    },[choosedAsset])

    useEffect(()=>{
        setLoading(true)
        setChoosedAsset(null)
        setBtnDisabled(true)
        fetchServer(collection)
        .then(data => {
            const newData = data.data.map(el=>
                ({
                    name : el.name ,
                    symbol : el.symbol ,
                    image : el.image,
                    current_price : el.current_price
                })
            )
            setAssets(newData)
            setFilteredAssets(newData)
            setLoading(false)
        })
        .catch(err => console.error(err))
    } , [collection])

    return(
        <>
        {!loading ? 
            <div className="flex-col font-mono p-1 sm:p-3 border  m-2 sm:m-4 text-xxs sm:text-sm ">
                <div className="text-center text-green-600 text-sm sm:text-lg">Create Alarm</div>
                <div className=" flex w-full justify-between p-1 sm:p-3">
                    <div>
                        market:
                    </div>
                    <select className="focus:outline-none" value={collection[0].toUpperCase()+collection.substring(1)} onChange={e => setCollection(e.target.value.toLowerCase())}>
                        <option>Stocks</option>
                        <option>Cryptocurrencies</option>
                        <option>Commodities</option>
                    </select>
                </div>
                <div className="flex w-full border justify-between p-1 sm:p-3">
                    <input type="text" placeholder="search..." className="focus:outline-none p-1 w-1/2 sm:w-auto" onChange={e => filterResult(e.target.value.toLowerCase())}/>
                    <ul className="overflow-auto h-10 w-1/2">
                        {filteredAssets.length!=0 && filteredAssets.map( el => 
                            (<Fragment key={el.symbol}>
                                <li className={`hidden ${menu ?'lg:block' : 'md:block' } cursor-pointer hover:bg-sky-100`} onClick={() => setChoosedAsset(el)}>{el.symbol} - {el.name}</li>
                                <li className={`block ${menu ? 'lg:hidden' : 'md:hidden'} cursor-pointer hover:bg-sky-100`} onClick={() => setChoosedAsset(el)}>{el.symbol}</li>
                            </Fragment>)
                        )}
                    </ul>
                </div>
                <div className="w-full flex justify-between p-1 sm:p-3">
                    <div className="">
                            {choosedAsset ? `${choosedAsset.symbol} - ${choosedAsset.name}`:"_ _ _ _ _ _ _"}
                    </div>
                    <div className="">
                            {choosedAsset ? `price: ${choosedAsset.current_price}` : "_ _ _"}
                    </div>
                </div>
                <div className="flex w-full justify-around p-1 sm:p-3">
                    <input type="number" value={targetPrice} min={0.00001} className="focus:outline-none p-1 border w-1/2 sm:w-auto" placeholder="target price" onChange={(e) => {
                        setBtnDisabled(!(Number(e.target.value)!= 0 && choosedAsset))
                        setTargetPrice(Number(e.target.value))
                    }}/>
                    <button className={`border rounded-md ${btnDisabled && 'bg-gray-100 text-gray-200'} p-1 sm:p-2`}  disabled={btnDisabled} onClick={async ()=>await handleAlertSubmit()}>Set alert</button>
                </div>
            </div>
            :
            <Spinner loading={loading}/>
        }
        </>
        
    )
}

export default Alert