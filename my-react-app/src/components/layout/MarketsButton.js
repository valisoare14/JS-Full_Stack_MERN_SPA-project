import { useDispatch , useSelector} from "react-redux"
import { setCollection } from "../../store/slices/slice"
import { useEffect, useState } from "react"

function MarketsButton(){
    const dispatch=useDispatch()
    const collection = useSelector(state=>state.global.collection)


    const[bg_b1,setBg_b1]=useState(false)
    const[bg_b2,setBg_b2]=useState(false)
    const[bg_b3,setBg_b3]=useState(false)

    function changeCollection(market) {
        dispatch(setCollection(market))
    }

    useEffect(()=>{
        setBg_b1('stocks' == collection)
        setBg_b2('commodities' == collection)
        setBg_b3('cryptocurrencies' == collection)
    },[collection])

    return(
        <div className="flex w-full">
            <button id='1' className={`${bg_b1 ? 'bg-sky-300' : 'bg-sky-500'} hover:bg-sky-100  flex-grow rounded-tl-xl rounded-bl-xl text-xs  sm:text-base`} onClick={()=>changeCollection('stocks')}>Stocks</button>
            <button id='2' className={`${bg_b2 ? 'bg-sky-300' : 'bg-sky-500'} hover:bg-sky-100  flex-grow text-xs  sm:text-base`} onClick={()=>changeCollection('commodities')}>Commodities</button>
            <button id='3' className={`${bg_b3 ? 'bg-sky-300' : 'bg-sky-500'} hover:bg-sky-100  flex-grow rounded-tr-xl rounded-br-xl text-xs  sm:text-base`} onClick={()=>changeCollection('cryptocurrencies')}>Cryptocurrencies</button>
        </div>
    )
}

export default MarketsButton