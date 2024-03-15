import { useEffect, useState } from "react"
import Table from "./layout/Table"
import { getWatchlistAssets } from "../api_s/getWatchlistAssets"
import MarketsButton from "./layout/MarketsButton"
import { useSelector , useDispatch} from "react-redux"
import { setAssets } from "../store/slices/slice"

function Watchlist(){
    const collection = useSelector(state=>state.global.collection)
    const [err,setErr] = useState(null)
    const assets = useSelector(state=>state.global.assets)
    const dispatch = useDispatch()

    async function fullAssetDetails(data , market) {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}${market}/symbols`,{
                method : "POST",
                headers :{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    "data": data.map(el=>el.symbol).toString()
                })
            })
            const result = await response.json()
            if(!response.ok) {
                throw new Error(result.message)
            }

            return result.data
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        getWatchlistAssets(collection,localStorage.getItem('token'))
        .then(async (data) => {
            if(data.length != 0)
                dispatch(setAssets(await fullAssetDetails(data,collection)))
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