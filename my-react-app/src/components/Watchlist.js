import { useEffect, useState } from "react"
import Table from "./layout/Table"
import { getWatchlistAssets } from "../api_s/getWatchlistAssets"
import MarketsButton from "./layout/MarketsButton"
import { useSelector , useDispatch} from "react-redux"
import { setAssets } from "../store/slices/slice"
import { getAssetDetailsBySymbol } from "../api_s/getAssetDetailsBySymbol"

function Watchlist(){
    const collection = useSelector(state=>state.global.collection)
    const token = useSelector(state=>state.global.token)
    const [err,setErr] = useState(null)
    const assets = useSelector(state=>state.global.assets)
    const dispatch = useDispatch()

    useEffect(()=>{
        getWatchlistAssets(collection,token)
        .then(async (data) => {
            if(data.length != 0) {
                dispatch(setAssets(await getAssetDetailsBySymbol(data.map(el=>el.symbol),collection)))
            } else{
                dispatch(setAssets(data))
            }
        })
        .catch(error =>{
            console.error(error)
            setErr(error.message)
        })
    },[collection])
    useEffect(()=>{
        
    },[assets])
    return(
        <>
            {!err ?
                <>
                    <MarketsButton/>
                    <Table watchlist={true}/>
                </>
            :
            <>
                //TODO
            </>
            }
        </>
    )
}

export default Watchlist