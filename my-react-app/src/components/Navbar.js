import {Link , useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { setMenu ,setNotificationCenter , setOnNotify , setToken } from '../store/slices/slice';
import { useDispatch } from 'react-redux';
import { deleteNotifications } from '../api_s/deleteNotifications';

function Navbar(){
    const token = useSelector(state=>state.global.token)
    const menu=useSelector(state=>state.global.menu)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)
    const onNotify=useSelector(state=>state.global.onNotify)

    const navigate=useNavigate()
    const dispatch=useDispatch()

    async function handleLogout(){
        try {
            dispatch(setMenu(false))
            await deleteNotifications(localStorage.getItem('token'))
            localStorage.removeItem('token')
            dispatch(setToken(localStorage.getItem('token')))
            navigate('/login',{
                replace:true
            })
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <div className='fixed w-screen inset-0 h-16.4 z-50 flex justify-between p-4 bg-green-600 rounded-md mr-1'>
            <img src='/icos/menu-hamburger.svg' className='symbol cursor-pointer' onClick={()=>{token?dispatch(setMenu(!menu)):navigate('/login')}}/>
            <div className='flex items-center gap-1 sm:gap-5'>
                <img src={`/icos/${onNotify?'notificationdot.png':'notification.svg'}` } alt="Notification logo" className="symbol cursor-pointer" onClick={()=>{dispatch(setNotificationCenter(!notificationCenter));dispatch(setOnNotify(false))}}/>
                {token
                ?
                    <button className="border border-black border-2 bg-white rounded-md  sm:p-1 text-xxs sm:text-base  w-10 sm:w-20 h-5 sm:h-auto" onClick={()=>handleLogout()}>
                        Logout
                    </button> 
                :
                    <Link to="/login" >
                        <button className="border border-black border-2 bg-white rounded-md  sm:p-1 text-xxs sm:text-base  w-10 sm:w-20 h-5 sm:h-auto">Login</button>
                    </Link>
                }
            </div>
       </div>
    )
}
export default Navbar