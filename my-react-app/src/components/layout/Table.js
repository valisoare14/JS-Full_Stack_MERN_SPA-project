import { useEffect  } from 'react'
import { useSelector , useDispatch} from 'react-redux'
import { updateWatchlistSymbols } from '../../api_s/updateWatchlistSymbols'
import { setWatchlistSymbols } from '../../store/slices/slice'
import Item from '../Item'
function Table(props){
    const dispatch = useDispatch()
    const collection = useSelector(state=>state.global.collection)
    const assets = useSelector(state=>state.global.assets)
    const {watchlist} = props

    useEffect(()=>{
        updateWatchlistSymbols(collection,localStorage.getItem('token'))
        .then(data=>{
            if (data.length != 0) {
                dispatch(setWatchlistSymbols(data))
            }
        })
        .catch(err=>console.error(err))
    },[collection])
    return(
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
    )
}

export default Table 