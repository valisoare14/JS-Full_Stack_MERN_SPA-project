import { useEffect,useState } from "react"
import { fetchNews } from "../api_s/fetchNews"
import New from "./New"
import Spinner from './layout/Spinner'

function News(){
    const [loading,setLoading] = useState(false)
    const [err,setErr]=useState(null)
    const [data,setData]=useState(null)

    useEffect(()=>{
        setLoading(true)

        fetchNews().then(data=>{
            setData(data)
            setLoading(false)
        }).catch(error=>{
            setErr(error)
            console.error(error)
        })
    },[])
    return(
        <>
        {!loading ?
                <>
                    {data?.feed?
                        data.feed.map(element=><New item={element}/>)
                        // <New item={data.feed[0]}/>
                        :
                        <div>
                            {err?.message}
                        </div>
                    }
                </>
                
            :
            <Spinner loading={loading}/>
        }
        
        </>                   
    )
}
export default News