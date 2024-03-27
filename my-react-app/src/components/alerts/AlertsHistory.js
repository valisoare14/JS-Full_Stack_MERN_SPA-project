import { useEffect, useState } from "react"
import { fetchAlerts } from "../../api_s/fetchAlerts"
import {useSelector } from "react-redux"
import { updateAlertStatus } from "../../api_s/updateAlertStatus"
import { deleteAlert } from "../../api_s/deleteAlert"

function AlertsHistory() {
    const [alerts , setAlerts] = useState([])
    const [collection , setCollection] = useState("active")
    const [loading , setLoading] = useState(false)
    const [btnsStates , setBtnsStates] = useState([1,0,0])
    const token = useSelector(state => state.global.token)
    const menu = useSelector(state => state.global.menu)
    const alertHistoryUpdate = useSelector(state => state.global.alertHistoryUpdate)

    async function manageAlert(_id , status ) {
        if(status == 'active') {
            await updateAlertStatus(_id , "canceled" , token)
        } else {
            await deleteAlert(_id , token)
        }
        setAlerts(alerts.filter(el => el._id != _id))
    }

    useEffect(()=>{
        setLoading(true)
        fetchAlerts(collection , token).then(data => {
            setAlerts(data)
            setLoading(false)
        })
        .catch(err => console.error(err.message))
    },[collection , alertHistoryUpdate])

    useEffect(()=>{},[alerts])

    return(
        <div className="flex-col text-xxs sm:text-sm font-mono p-1 sm:p-3 border  m-2 sm:m-4 min-w-45 sm:min-w-55">
            <div className="text-center text-green-600 text-sm sm:text-lg">Alarms History</div>
            <div className="flex justify-around p-1 sm:p-3 text-xs sm:text-base">
                <button className={`m-1 hover:bg-sky-100 ${btnsStates[0] == 1 && 'underline decoration-sky-500'} `} onClick={()=> {setCollection("active") ; setBtnsStates([1,0,0])}}>Active</button>
                <button className={`m-1 hover:bg-sky-100 ${btnsStates[1] == 1 && 'underline decoration-sky-500'}`} onClick={()=> {setCollection("canceled") ; setBtnsStates([0,1,0])}}>Canceled</button>
                <button className={`m-1 hover:bg-sky-100 ${btnsStates[2] == 1 && 'underline decoration-sky-500'}`} onClick={()=> {setCollection("triggered") ; setBtnsStates([0,0,1])}}>Triggered</button>
            </div>
            {!loading &&
            <ul className="overflow-auto h-40">
                {alerts.length!=0 && alerts.map(el => <li key={el._id} className={`grid grid-cols-4  ${menu ? 'lg:grid-cols-5':'md:grid-cols-5'} border-t-1 border-b-1 items-center`}>
                    <img src={el.image} alt="img" className="symbol"/>
                    <div className={`hidden ${menu ? 'lg:block':'md:block'}`}>{el.name}</div>
                    <div>{el.symbol}</div>
                    {collection == 'active' ? 
                        <div>trigger price: {el.priceTarget}$</div>
                        :
                        <div>{el.status}</div>
                    }
                    <button className={`bg-gray-200 sm:p-1`} onClick={async ()=>{await manageAlert(el._id , el.status)}}>{collection == 'active' ? 'cancel' : 'delete'}</button>
                </li>)}
            </ul>
            }
        </div>
    )
}

export default AlertsHistory