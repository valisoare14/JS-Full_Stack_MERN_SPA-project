import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchCalendarEventsByDay } from "../api_s/fetchCalendarEventsByDay"
import CalendarEvent from "./CalendarEvent"
import { pushNotification } from "../api_s/pushNotification"
import { useDispatch } from "react-redux"
import { setOnNotify } from "../store/slices/slice"
import Spinner from "./layout/Spinner"

function Calendar(){
    const[targetDay , setTargetDay] = useState(Date.now())
    const [events , setEvents] = useState([])
    const [loading,setLoading] = useState(false)
    const [leftButton , setLeftButton]=useState(true)
    const [rightButton , setRightButton]=useState(true)
    const menu=useSelector(state=>state.global.menu)
    const dispatch = useDispatch()
    const daysOfWeeks=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

    function lastDay(){
        const day = targetDay - 24*60*60*1000
        setTargetDay(day)
    }

    function nextDay(){
        const day = targetDay + 24*60*60*1000
        setTargetDay(day)
    }

    function toDd_Mm_YyyyFormat(ndate){
        const date = new Date(ndate)
        const day = date.getDate().toString().padStart(2,'0')
        const month = (date.getMonth()+1).toString().padStart(2,'0')
        const year = date.getFullYear().toString()
        return `${day}-${month}-${year}`
    }

    useEffect(()=>{
        setLoading(true)

        const weeksBack = process.env.REACT_APP_ECONOMIC_CALENDAR_WEEKS_BACK
        const weeksFront = process.env.REACT_APP_ECONOMIC_CALENDAR_WEEKS_FRONT
        fetchCalendarEventsByDay(targetDay,weeksBack,weeksFront)
        .then(data =>{
            setEvents(data)
            setLoading(false)
        })
        .catch(err=>console.error(err))

        if(((Date.now()-targetDay)/(1000*60*60*24)).toFixed(0) >=15){
            setLeftButton(false)
            dispatch(setOnNotify(true))
        }
        if(((Date.now()-targetDay)/(1000*60*60*24)).toFixed(0) <= -15 ){
            setRightButton(false)
            dispatch(setOnNotify(true))
        }
    },[targetDay])

    return(
        <>
            <div className={`flex ${menu?'w-full sm:w-3/5':'w-1/2'}`}>
                {leftButton && <img src='/icos/arrow-left.svg' className="symbol cursor-pointer" onClick={()=>{lastDay();if(!rightButton) setRightButton(true)}}/>}
                <div className="flex-col flex-grow ">
                    <div className="text-center">
                        {daysOfWeeks[((new Date(targetDay)).getDay()-1) != -1 ? ((new Date(targetDay)).getDay()-1) : 6]}
                    </div>
                    <div className="text-center">{toDd_Mm_YyyyFormat(targetDay)}</div>
                </div>
                {rightButton && <img src='/icos/arrow-right.svg' className="symbol cursor-pointer" onClick={()=>{nextDay();if(!leftButton) setLeftButton(true)}}/>}
            </div>  
            {!loading ?  
                <>
                    {events.length !== 0 ?
                    events.reverse().sort((e,f)=>new Date(e['date'])-new Date(f['date'])).map(ev => <CalendarEvent event={ev} key={ev._id}/>)
                    :
                        <>
                            {
                                (!leftButton ) || (!rightButton)?
                                    <div className={`m-4 border-t-2 border-b-2 p-1 ${menu?'w-full sm:w-3/5':'w-1/2'} text-center text-xxs sm:text-base font-mono`}>
                                        Interval limit reached !
                                    </div>
                                :
                                    <div className={`m-4 border-t-2 border-b-2 p-1 ${menu?'w-full sm:w-3/5':'w-1/2'} text-center text-xxs sm:text-base font-mono`}>
                                        No events for the day !
                                    </div>
                            }
                        </>
                    }
                </>  
                :
                <Spinner loading={loading}/>
            }          
           
        </>
    )
}

export default Calendar