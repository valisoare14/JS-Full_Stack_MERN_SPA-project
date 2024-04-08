import { useState , useEffect } from "react"
import { getFeedbacks } from "../../api_s/getFeedbacks"
import {useSelector , useDispatch } from 'react-redux'
import { postFeedback } from "../../api_s/postFeedback"
import { pushNotification } from "../../api_s/pushNotification"
import { setOnNotify , setPushUpMessage } from "../../store/slices/slice"
import { calculateProportion } from "../../utils/calculateProportion"

function Feedback(props) {
    const {asset}=props
    const [reaction , setReaction] = useState(null)
    const [enableComment , setEnableComment] = useState(false)
    const token = useSelector(state=>state.global.token)
    const [feedbacks , setFeedbacks] = useState([])
    const [submitBtnDisabled , setSubmitBtnDisabled] = useState(false)
    const [comment , setComment] = useState('')
    const [feedbackSubmitted , setFeedbackSubmitted] = useState(false)
    const dispatch = useDispatch()

    async function handleCommentSubmit(event) {
        event.preventDefault()
        try {
            await postFeedback(token , asset.symbol , reaction , comment)
            const message = `You gave a ${reaction} feedback on ${asset.symbol}`
            await pushNotification(message , token)
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(message))
            setEnableComment(false)
            setFeedbackSubmitted(true)
        } catch (error) {
            console.error(error)
        }
    }

    function checkCommentLength(e) {
        const value = e.target.value
        const length = value.length
        if(length > 100) {
            setSubmitBtnDisabled(true)
        } else {
            if(submitBtnDisabled) {
                setSubmitBtnDisabled(false)
            }
        }
    }

    useEffect(()=>{
        getFeedbacks(token , asset.symbol).then(data => {
            setFeedbacks(data.feedbacks)
            setReaction(data.feedbackGiven)
            setFeedbackSubmitted(data.feedbackGiven ? true : false)
        }).catch(error => console.error(error))
    },[feedbackSubmitted])
    return(
        <div className="flex-col  w-60/100 m-1 sm:m-4  text-xxs sm:text-sm">
            <div className="text-center w-full">
                How do you feel about {asset.symbol} today ?
            </div>
            <div className="relative flex justify-between rounded-md border w-full p-1 sm:p-4">
                <img src="icos/reactions/flamereaction.png" className={`symbol cursor-pointer`} onClick={()=>{setReaction("bullish") ; setEnableComment(true)}}/>                       
                {feedbackSubmitted &&
                <div style={{width : `${calculateProportion(feedbacks)[0] > 90 || calculateProportion(feedbacks)[0] < 10 ? 
                            calculateProportion(feedbacks)[0] > 90 ? '90': '10' 
                        : 
                            calculateProportion(feedbacks)[0]}%`}} 
                     className={`flex bg-${feedbackSubmitted ? 'green-600':'white'} rounded-md p-1 sm:p-3 text-center`
                }>
                    {`${calculateProportion(feedbacks)[0]}%`}
                </div>}
                {feedbackSubmitted && 
                <div style={{width : `${calculateProportion(feedbacks)[1] > 90 || calculateProportion(feedbacks)[1] < 10 ? 
                            calculateProportion(feedbacks)[1] > 90 ? '90': '10' 
                        : 
                            calculateProportion(feedbacks)[1]}%`}}  
                    className={`flex flex-row-reverse  ${feedbackSubmitted ? 'bg-red-600':'bg-white'} rounded-md p-1 sm:p-3 text-center`
                }>
                    {`${calculateProportion(feedbacks)[1]}%`}
                </div>}
                <img src="icos/reactions/downarrowreaction.png" className={`symbol cursor-pointer`} onClick={()=>{setReaction("bearish") ; setEnableComment(true)}}/>
                {reaction && <div className="absolute inset-0 bg-gray-400 bg-opacity-20"/>}
            </div>
            {enableComment && 
                <form className="flex flex-col mt-1"  onSubmit={handleCommentSubmit}>
                    <textarea type="text" placeholder="leave a comment..." className={`focus:outline-none rounded-md pl-1 h-8 overflow-hidden ${submitBtnDisabled && 'border border-red-500'} border`} rows={1} onChange={(e) => {checkCommentLength(e) ; setComment(e.target.value)}}/>
                    {submitBtnDisabled && <div className="text-red-500 text-center">comment's accepted length exceeded</div>}
                    <button type="submit" 
                            className="border rounded-sm bg-gray-100 mt-1" 
                            disabled={submitBtnDisabled}>
                        Submit
                    </button>
                </form>
            }
        </div>
    )
}


export default Feedback