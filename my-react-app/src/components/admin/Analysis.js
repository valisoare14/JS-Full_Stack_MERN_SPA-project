import { useEffect, useState } from "react"
import {useSelector , useDispatch} from 'react-redux'
import { pushNotification } from "../../api_s/pushNotification"
import { setOnNotify , setPushUpMessage , setAnalysesDialogWindow} from "../../store/slices/slice"
import AnalysesDialogWindow from "./AnalysesDialogWindow"

function Analysis(){
    const topics = ['Blockchain',
        'Earnings',
        'IPO',
        'Mergers & Acquisitions',
        'Financial Markets',
        'Fiscal Policy ',
        'Monetary Policy ',
        'Macro',
        'Energy',
        'Transportation',
        'Finance',
        'Life Sciences',
        'Manufacturing',
        'Real Estate & Construction',
        'Retail & Wholesale',
        'Technology']
    const dispatch = useDispatch() 
    const adminToken = useSelector(state => state.global.adminToken)
    const token = useSelector(state => state.global.token)
    const analysesDialogWindow = useSelector(state => state.global.analysesDialogWindow)

    const [checkedTopics , setCheckedTopics] = useState([])
    const [titleInput , setTitleInput] = useState('')
    const [contentInput,setContentInput ] = useState('')
    const [saveAnalysisBtnDisabled , setSaveAnalysisBtnDisabled] = useState(true)

    function handleCheckBoxChange(event){
        const { value, checked } = event.target;

        if (checked) {
            setCheckedTopics([...checkedTopics , value]);
        } else {
            setCheckedTopics(checkedTopics.filter(cv => cv!==value));
        }
    }

    function handleKeyDown(event){
        if (event.key === 'Tab') {
            event.preventDefault();
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            const newValue = contentInput.substring(0, start) + "\t" + contentInput.substring(end);
            setContentInput(newValue);
            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = start + 1;
            }, 0);
        }
    }

    function handleAnalysisPost(){
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}analyses`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${adminToken}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                title : titleInput,
                topics : checkedTopics,
                content : contentInput
            })
        }).then(response => {
            if(!response.ok) {
                return response.json().then(result => {
                    throw new Error(result.message)
                })
            }
            return response.json()
        }).then(result => {
            pushNotification(result.message , token).catch(err => console.error(err))
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(result.message))
            setTitleInput('')
            setContentInput('')
            setCheckedTopics([])
        }).catch(err => console.error(err))
    }

    useEffect(()=>{
        if(titleInput!=='' && checkedTopics.length!==0 && contentInput.split(' ').length>=100) {
            setSaveAnalysisBtnDisabled(false)
        } else {
            setSaveAnalysisBtnDisabled(true)
        }
    },[titleInput , checkedTopics , contentInput])

    return(
        <>
            <div className="flex flex-col w-full h-full p-1 xs:p-2  md:p-3 
                bg-gray-200 font-mono gap-4
                text-xxxs xxs:text-xxs xs:text-xs sm:text-sm md:text-base">
                <button className="pl-1 pr-1 xs:pl-3 xs:pr-3 border text-white bg-orange-600 rounded-md self-end"
                    onClick={() => dispatch(setAnalysesDialogWindow(!analysesDialogWindow))}>
                    browse all <br/> analyses...
                </button>
                <div className="flex flex-col xxs:flex-row xxs:gap-4 pr-1 pl-1 xs:pl-3 xs:pr-3">
                    <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg font-bold w-12 sm:w-16">
                        Title
                    </div>
                    <input type="text" 
                        className="focus:outline-none p-1 xs:p-2 flex-grow xs:flex-none rounded-sm w-auto sm:w-96"
                        value={titleInput}
                        onChange={(event) => setTitleInput(event.target.value)}/>
                </div>
                <div className="flex flex-col xxs:flex-row xxs:gap-4 pr-1 pl-1 xs:pl-3 xs:pr-3">
                    <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg font-bold w-12 sm:w-16">
                        Topics
                    </div>
                    <form className="flex flex-col overflow-auto h-16 xs:h-30 gap-1 bg-white rounded-sm p-1 ">
                        {topics.map(t => <label key={t}>
                            <input type="checkbox" 
                                value={t}
                                checked={checkedTopics.includes(t)}
                                onChange={handleCheckBoxChange}/>
                            {` ${t}`}
                        </label>)}
                    </form>
                </div>
                <div className="flex flex-col xxs:flex-row xxs:gap-4 pr-1 pl-1 xs:pl-3 xs:pr-3 flex-grow">
                    <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg font-bold w-12 sm:w-16">
                        Content
                    </div>
                    <div className="flex flex-col jusitfy-center bg-gray-200 flex-grow ">
                            <textarea type='text' 
                                className="h-full focus:outline-none p-1 xs:p-2 border m-1 rounded-sm"
                                value={contentInput}
                                placeholder="Please create an analysis of at least 100 words !"
                                onKeyDown={handleKeyDown}
                                onChange={(event) => setContentInput(event.target.value)}/>
                            <button className="relative pl-1 pr-1 border m-1 bg-green-600 text-white w-30 self-end rounded-sm"
                                disabled={saveAnalysisBtnDisabled}
                                onClick={handleAnalysisPost}>
                                save <br/>analysis
                                {saveAnalysisBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                            </button>
                    </div>
                </div>
            </div>
            {analysesDialogWindow && <AnalysesDialogWindow/>}
        </>
    )
}

export default Analysis