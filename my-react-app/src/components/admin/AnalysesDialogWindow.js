import { useSelector , useDispatch } from "react-redux"
import { setAnalysesDialogWindow , setOnNotify , setPushUpMessage} from "../../store/slices/slice"
import { useEffect, useState } from "react"
import { fetchAnalyses } from "../../api_s/fetchAnalyses"
import {changeDateFormat} from '../../utils/changeDateFormat'
import { pushNotification } from "../../api_s/pushNotification"


function AnalysesDialogWindow(){
    const dispatch = useDispatch()
    const analysesDialogWindow = useSelector(state => state.global.analysesDialogWindow)
    const adminToken = useSelector(state => state.global.adminToken)
    const token = useSelector(state => state.global.token)

    const [analyses , setAnalyses] = useState([])
    const [fullContentId , setFullContentId] = useState(null)

    function deleteAnalysis(analysis) {
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}analyses/${analysis._id}`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${adminToken}`
            }
        }).then(response => {
            if(!response.ok){
                return response.json().then(result => {
                    throw new Error(result.message)
                })
            }
            return response.json()
        }).then(result => {
            pushNotification(result.message , token).catch(err => console.error(err))
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(result.message))
            setAnalyses(analyses.filter(a => a._id != analysis._id))
        }).catch(err => console.error(err))
    }

    useEffect(()=>{
        fetchAnalyses(token).then(result => {
            if(result.data) {
                setAnalyses(result.data)
            }
        }).catch(err => console.error(err))
    },[])
    return(
        <>
            <div className="absolute inset-0 bg-gray-400 bg-opacity-60"></div>
            <div className="flex flex-col overflow-auto bg-white font-mono p-1 xs:p-3 gap-2
                absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2
                text-xxxs xxs:text-xxs xs:text-xs sm:text-sm
                w-full xs:w-65/100 h-65/100 xs:h-80/100">
                <img src="/icos/leftstraightarrow.svg" 
                    className="symbol cursor-pointer"
                    onClick={() => dispatch(setAnalysesDialogWindow(!analysesDialogWindow))}/>
                {analyses.length!==0 && analyses.map(a => <div className="flex flex-col border p-1 gap-1" key={a._id}>
                    <button className="self-end pl-1 pr-1 xs:pl-3 xs:pr-3 bg-red-600 text-white rounded-sm"
                        onClick={() => deleteAnalysis(a)}>
                        delete
                    </button>
                    <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base font-bold text-center">{a.title}</div>
                    <div>{changeDateFormat(a.time_published)}</div>
                    <div className="inline-flex gap-1">
                        {'topics: '}{a.topics.length !== 0 && a.topics.map(t => <span className="underline decoration-green-600" key={t}>{t}</span>)}
                    </div>
                    <div className="w-full" style={{whiteSpace:"pre-wrap"}}>
                        {'content: '}<br/>{a._id === fullContentId ? a.content :  a.content.substring(0,45)}<span className="text-sky-600 cursor-pointer" onClick={() =>setFullContentId(a._id)}>{a._id !== fullContentId ? ' ...read more' : ''}</span>
                    </div>
                </div>)}
            </div>
        </>
    )
}

export default AnalysesDialogWindow

/*app.get('/show-content', (req, res) => {
  Content.findById(req.query.id) // assuming you pass the ID of the content to retrieve
    .then(content => {
      const formattedBody = content.body.replace(/\n/g, '<br>'); // replace newlines with <br> for HTML display
      res.send(`<div style="white-space: pre-wrap;">${formattedBody}</div>`);
    })
    .catch(err => res.status(500).send(err.message));
}); */