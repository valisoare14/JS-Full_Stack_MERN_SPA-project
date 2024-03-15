import { useEffect, useState } from "react"
import { pushNotification } from "../api_s/pushNotification"
import { useDispatch,useSelector } from "react-redux"
import { setOnNotify , setWatchlistSymbols , setAssets } from "../store/slices/slice"
import { manageWatchlistAsset } from "../api_s/manageWatchlistAsset"
import { updateWatchlistSymbols } from "../api_s/updateWatchlistSymbols"

function Item(props){
    const watchlistSymbols = useSelector(state=>state.global.watchlistSymbols)
    const assets = useSelector(state=>state.global.assets)
    const {item , watchlist }=props
    const [selected , setSelected] = useState(false)
    const dispatch = useDispatch()

    async function manageWatchlist() {
        await manageWatchlistAsset(selected ? 'DELETE' : 'POST' , item.symbol , localStorage.getItem('token') , item.market)
        await updateWatchlistSymbols(item.market , localStorage.getItem('token'))
        .then(data=>{
            if (data.length != 0) {
                dispatch(setWatchlistSymbols(data))
            }
        })
        .catch(err=>console.error(err))
        if(selected && watchlist) {
            dispatch(setAssets(assets.filter(el => el.symbol != item.symbol)))
        }
        await pushNotification(`${item.name} ${selected ? 'removed from' : 'added to'} watchlist !`)
        dispatch(setOnNotify(true))
        setSelected(!selected)
    }
    useEffect(()=>{
        setSelected(watchlistSymbols.includes(item.symbol))
    },[watchlistSymbols])
    return(
        <tr className="border-b-2 h-4">
            <td className="p-1 sm:p-3 flex items-center"><img src={`/icos/${selected ?'filled_star.png':'star.svg'}`} className="symbol mr-1 sm:mr-2 cursor-pointer" onClick={async()=>await manageWatchlist()}/> {item.image && <img src={item.image} className="w-4 h-4 sm:w-10 sm:h-10 mr-5"/>}<>{item.name}</></td>
            <td className="p-1 sm:p-3">{item.symbol}</td>
            <td className="p-1 sm:p-3">{'$ '+(item.current_price).toLocaleString('en-US')}</td>
            <td className={`p-1 sm:p-3 ${item.price_change_percentage_24h<0 ?'text-red-400':'text-green-400'}`}>{Number(item.price_change_percentage_24h).toFixed(2).toString()+" %"}</td>
        </tr>
    )
}
export default Item