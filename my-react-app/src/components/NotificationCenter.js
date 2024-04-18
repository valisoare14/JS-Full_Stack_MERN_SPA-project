import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setNotificationCenter } from "../store/slices/slice"
import Notification from "./Notification"
import { useEffect,useState } from "react"
import { getNotifications } from "../api_s/getNotifications"

function NotificationCenter(){
    const [notifications,setNotifications]=useState(null)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)
    const token = useSelector(state=>state.global.token)

    const dispatch=useDispatch()

    useEffect(()=>{
        getNotifications(token).then(data=>setNotifications(data))
        .catch(err=>console.error(err))
    },[])
    return(
        <div className="fixed w-screen h-screen inset-0 bg-gray-400 bg-opacity-80 z-50">
            <div className="absolute transform w-4/5 xxs:w-3/5 h-2/5 sm:h-3/5 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-md overflow-hidden">
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-end">
                        <p className="w-full font-mono text-green-600 text-center text-sm sm:text-lg">Notification Center</p>
                        <img src='/icos/x.svg' className="symbol justify-self-end sm:p-1 m-1 bg-opacity-0 cursor-pointer" onClick={()=>dispatch(setNotificationCenter(!notificationCenter))}/>
                    </div>
                    <ul className="overflow-auto h-grow m-2 ">
                        {notifications&&
                            notifications.reverse().map(e=><Notification  key={e._id} message={e.message} timestamp={e.timestamp}/>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default NotificationCenter