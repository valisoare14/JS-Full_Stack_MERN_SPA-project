import {Link , useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { setMenu ,setNotificationCenter , setOnNotify ,
     setToken , setAdminAuthentificationDialogWindow , setAdminToken} from '../store/slices/slice';
import { useDispatch } from 'react-redux';
import { deleteNotifications } from '../api_s/deleteNotifications';
import PushupNotification from './layout/PushupNotification';
import AdminAuthentificationDialogWindow from './layout/AdminAuthentificationDialogWindow';


function Navbar(){
    const token = useSelector(state=>state.global.token)
    const menu=useSelector(state=>state.global.menu)
    const pushUpMessage=useSelector(state=>state.global.pushUpMessage)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)
    const onNotify=useSelector(state=>state.global.onNotify)
    const adminAuthentificationDialogWindow=useSelector(state=>state.global.adminAuthentificationDialogWindow)
    const adminToken=useSelector(state=>state.global.adminToken)

    const navigate=useNavigate()
    const dispatch=useDispatch()

    async function handleLogout(){
        try {
            dispatch(setMenu(false))
            dispatch(setAdminToken(null))
            await deleteNotifications(token)
            sessionStorage.removeItem('adminToken')
            sessionStorage.removeItem('token')
            dispatch(setToken(sessionStorage.getItem('token')))
            navigate('/login',{
                replace:true
            })
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <div className={`fixed w-screen inset-0 h-10vh z-50 flex justify-between p-4 ${adminToken ? 'bg-sky-600' : 'bg-green-600'} rounded-md mr-1`}>
            {adminToken ? <button className='border p-1 rounded-md text-orange-200 bg-sky-700 w-16 xs:w-20 h-8 sm:h-10 text-xxs self-center'
                        onClick={() => {
                            sessionStorage.removeItem('adminToken')
                            dispatch(setAdminToken(null))
                            navigate('/')
                        }}>
                    switch to <br/>user
                </button>:
            <img src='/icos/menu-hamburger.svg' className='symbol cursor-pointer' onClick={()=>{token?dispatch(setMenu(!menu)):navigate('/login')}}/>}
            <div className='flex items-center gap-1 sm:gap-5'>
                {token && !adminToken && <button className='border p-1 rounded-md text-orange-200 bg-green-700 w-16 xs:w-20 h-8 sm:h-auto text-xxs'
                        onClick={() => {
                            dispatch(setAdminAuthentificationDialogWindow(!adminAuthentificationDialogWindow))
                            dispatch(setMenu(false))
                        }}>
                    switch to <br/> admin
                </button>}
                <img src={`/icos/${onNotify?'notificationdot.png':'notification.svg'}` } alt="Notification logo" className="symbol cursor-pointer" onClick={()=>{dispatch(setNotificationCenter(!notificationCenter));dispatch(setOnNotify(false))}}/>
                {token
                ?
                    <button className="border border-black border-2 bg-white rounded-md  sm:p-1 text-xxs sm:text-base   w-16 xs:w-20 h-8 sm:h-auto" onClick={()=>handleLogout()}>
                        Logout
                    </button> 
                :
                    <Link to="/login" >
                        <button className="border border-black border-2 bg-white rounded-md  sm:p-1 text-xxs sm:text-base   w-16 xs:w-20 h-8 sm:h-auto">Login</button>
                    </Link>
                }
            </div>
            {pushUpMessage.length !=0 && <PushupNotification/>}
            {adminAuthentificationDialogWindow && <AdminAuthentificationDialogWindow/>}
       </div>
    )
}
export default Navbar