import { useEffect } from 'react'
import {fetchServer} from '../api_s/fetchServer'
import {useSelector ,useDispatch} from 'react-redux'
import {setAssets,setLastUpdate,setError } from '../store/slices/slice'
import Table from './layout/Table'

function AssetsList(){
    const collection=useSelector(state=>state.global.collection)
    const assets=useSelector(state=>state.global.assets)
    const error=useSelector(state=>state.global.error)

    const dispatch=useDispatch()
    //eg.: dispatch(setCollection('stocks'))
    useEffect(()=>{
        fetchServer(collection).then(el=>{
            if(el.data){
                dispatch(setAssets(el.data))
                dispatch(setLastUpdate(el.timestamp))
                dispatch(setError(null))
            }
            else{
                dispatch(setLastUpdate(null))
                dispatch(setAssets(null))
                dispatch(setError(el))
            }
        }).catch(err=>console.error(err))
        
    },[collection])
    return(
        <>
            {!error 
                ?
                <Table watchlist={false}/>
                :
                <>
                    //TODO
                </>
            }
        </>
    )
}
export default AssetsList