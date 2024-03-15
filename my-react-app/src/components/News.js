import { useEffect,useState } from "react"
import { fetchNews } from "../api_s/fetchNews"
import Navbar from "./Navbar"
import { useSelector } from "react-redux"
import New from "./New"

function News(){
    const [err,setErr]=useState(null)
    const [data,setData]=useState(null)
    const menu=useSelector(state=>state.global.menu)

    useEffect(()=>{
        fetchNews().then(data=>{
            if(data.feed){
                setData(data)
            }
            else{
                throw new Error(data.message)
            }
        }).catch(error=>{
            setErr(error)
            console.error(error)
        })
    },[])
    return(
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
    )
}
export default News