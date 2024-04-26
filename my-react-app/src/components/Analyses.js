import { useSelector } from "react-redux"
import { useState , useEffect } from "react"
import {fetchAnalyses} from '../api_s/fetchAnalyses'
import { changeDateFormat } from "../utils/changeDateFormat"

function Analyses(){
    const [analyses , setAnalyses] = useState([])

    const token = useSelector(state => state.global.token)
    const [fullContentId , setFullContentId] = useState(null)

    useEffect(()=>{
        fetchAnalyses(token).then(result => {
            if(result.data) {
                setAnalyses(result.data)
            }
        }).catch(err => console.error(err))
    },[])

    return(
        <div className="flex flex-col w-full h-full overflow-auto items-center bg-gray-400 p-3 gap-4  text-xxxs xxs:text-xxs xs:text-xs sm:text-sm">
            {analyses.length!==0 && analyses.map(a => <div className="flex flex-col border p-1 gap-1 w-full sm:w-70/100 bg-white rounded-md" key={a._id}>
                    <div className="text-xs xxs:text-sm xs:text-base sm:text-lg font-bold text-center">{a.title}</div>
                    <div><span className="font-bold">{'date: '}</span>{changeDateFormat(a.time_published)}</div>
                    <div className="inline-flex gap-3">
                        <span className="font-bold">{'topics: '}</span>{a.topics.length !== 0 && a.topics.map(t => <span className="underline decoration-green-600" key={t}>{t}</span>)}
                    </div>
                    <div className="w-full" style={{whiteSpace:"pre-wrap"}}>
                        <span className="font-bold">{'content: '}</span><br/>{a._id === fullContentId ? a.content :  a.content.substring(0,45)}<span className="text-sky-600 cursor-pointer" onClick={() =>setFullContentId(a._id)}>{a._id !== fullContentId ? ' ...read more' : ''}</span>
                    </div>
                </div>)}
        </div>
    )
}

export default Analyses