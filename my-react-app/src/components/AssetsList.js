import { useEffect, useState } from 'react'
import {fetchServer} from '../api_s/fetchServer'
import {useSelector ,useDispatch} from 'react-redux'
import {setAssets,setLastUpdate,setError } from '../store/slices/slice'
import Table from './layout/Table'
import Spinner from './layout/Spinner'

function AssetsList(){
    const collection=useSelector(state=>state.global.collection)
    const error=useSelector(state=>state.global.error)
    const [loading,setLoading] =useState(false)

    const dispatch=useDispatch()
    
    useEffect(()=>{
        setLoading(true)
        fetchServer(collection).then(el=>{
            dispatch(setAssets(el.data))
            dispatch(setLastUpdate(el.timestamp))
            dispatch(setError(null))
            setLoading(false)
        }).catch(err=>{
            console.error(err)
            setError(err.message)
        })
    },[collection])
    return(
        <>
            {!error 
                ?
                <>
                {!loading ?
                    <Table watchlist={false}/> 
                        :
                    <Spinner loading={loading}/>
                }
                </>
                :
                <>
                    //TODO
                </>
            }
        </>
    )
}
export default AssetsList