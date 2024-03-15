import { useSelector } from "react-redux"
import { redirect } from "react-router-dom"

function CalendarEvent(props){
    const {event} = props
    const date_ = new Date(event.date)
    const menu = useSelector(state => state.global.menu)

    return(
        <div className={`relative grid grid-cols-4 gap-2 m-4 border-t-2 border-b-2 p-1 ${menu?'w-full sm:w-3/5':'w-1/2'}`}>
            {(date_.getTime() + 2*60*60*1000) - Date.now() < 0 &&
                <div class="absolute inset-0 bg-white bg-opacity-50">
                    
                </div>
            }
            <img src={`/icos/calendar/${event.impact.toLowerCase()}event.png`} className="symbol"/>
            <div className="bg-gray-100 rounded-md col-span-2 text-center text-xxs sm:text-base font-bold">{event.event}</div>
            <div className="bg-gray-100 rounded-md text-center text-xxs sm:text-base">{`${(date_.getHours()+2 >= 24?(date_.getHours()+2)%24:(date_.getHours()+2)).toString().padStart(2,'0')}:${date_.getMinutes().toString().padStart(2,'0')}`}</div>
            <div className="bg-gray-100 rounded-md flex-col items-center overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Impact</div>
                <div className="text-center text-xxxs sm:text-sm">{event.impact.toLowerCase()}</div>
            </div>
            <div className="bg-gray-100 rounded-md flex-col items-center overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Country</div>
                <div className="text-center text-xxxs sm:text-sm">{event.country}</div>
            </div>
            <div className="bg-gray-100 rounded-md col-span-2 flex-col items-center">
                <div className="text-center text-xxs sm:text-base">Currency</div>
                <div className="text-center text-xxxs sm:text-sm">{event.currency}</div>
            </div>
            <div className="bg-gray-100 rounded-md"></div>
            <div className="bg-gray-100 rounded-md flex-col items-center overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Actual</div>
                <div className="text-center text-xxxs sm:text-sm">{event.actual !== null?event.actual:'-'}</div>
            </div>
            <div className="bg-gray-100 rounded-md flex-col overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Estimate</div>
                <div className="text-center text-xxxs sm:text-sm">{event.estimate !==null?event.estimate:'-'}</div>
            </div>
            <div className="bg-gray-100 rounded-md flex-col overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Previous</div>
                <div className="text-center text-xxxs sm:text-sm">{event.previous !==null?event.previous:'-'}</div>
            </div>
            <div className="bg-gray-100 rounded-md"></div>
            <div className="bg-gray-100 rounded-md col-span-2 flex-col items-center">
                <div className="text-center text-xxs sm:text-base">Change</div>
                <div className="text-center text-xxxs sm:text-sm">{event.change !==null ? event.change.toFixed(2):'-'}</div>
            </div>
            <div className="bg-gray-100 rounded-md flex-col items-center overflow-hidden">
                <div className="text-center text-xxs sm:text-base">Change %</div>
                <div className="text-center text-xxxs sm:text-sm">{event.changePercentage !==null ? event.changePercentage.toFixed(1).toString()+'%' : '-'}</div>
            </div>
    </div>
    )
}

export default CalendarEvent