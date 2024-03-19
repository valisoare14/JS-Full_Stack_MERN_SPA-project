import { useEffect  } from 'react'
import { useSelector , useDispatch} from 'react-redux'
import { updateWatchlistSymbols } from '../../api_s/updateWatchlistSymbols'
import { setWatchlistSymbols } from '../../store/slices/slice'
import Item from '../Item'
import { Link } from 'react-router-dom'
function Table(props){
    const token = useSelector(state => state.global.token)
    const dispatch = useDispatch()
    const collection = useSelector(state=>state.global.collection)
    const assets = useSelector(state=>state.global.assets)
    const {watchlist} = props

    useEffect(()=>{
        if (token) {
            updateWatchlistSymbols(collection,token)
            .then(data=>{
                if (data.length != 0) {
                    dispatch(setWatchlistSymbols(data))
                }
            })
            .catch(err=>console.error(err))
        }
    },[collection])
    return(
        <>
            <table className="w-full ">
                <thead className='border-b-2 border-t-2 border-black text-xs  sm:text-base '>
                    <tr>
                        <td className=' p-1 sm:p-3 text-center sm:text-left'>Name</td>
                        <td className='p-1 sm:p-3 text-center sm:text-right'>Symbol</td>
                        <td className='p-1 sm:p-3 text-center sm:text-right'>Price</td>
                        <td className='p-1 sm:p-3 text-center sm:text-right'>24h %</td>
                    </tr>
                </thead>
                <tbody className='pl-1 pr-1 truncate text-xs text-center sm:text-base sm:text-right'>
                    {assets.length!=0 && assets.map(asset =><Item item={asset} watchlist={watchlist} key={asset.symbol}/>)}
                </tbody>
            </table>
            {assets.length==0 && 
            <div className='flex items-center m-4 text-xxs sm:text-base'>
                <div className='flex-grow'>No assets in watchlist for this specific market !</div>
                <Link to='/'>
                    <button className='border rounded-xl p-2 bg-white hover:bg-gray-400 m-2'>
                        Add assets
                    </button>
                </Link>
            </div>}
        </>
    )
}

export default Table 