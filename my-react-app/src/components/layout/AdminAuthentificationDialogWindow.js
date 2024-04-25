import { useSelector , useDispatch} from "react-redux"
import { setAdminAuthentificationDialogWindow , setAdminToken , setOnNotify , setPushUpMessage } from "../../store/slices/slice"
import { useState } from "react"
import { pushNotification } from "../../api_s/pushNotification"
import { useNavigate } from "react-router-dom"

function AdminAuthentificationDialogWindow(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const adminAuthentificationDialogWindow=useSelector(state=>state.global.adminAuthentificationDialogWindow)
    const token=useSelector(state=>state.global.token)
    const [err , setErr] = useState(null)
    const [adminKey , setAdminKey] = useState('')
    const [verifyBtnDisabled , setVerifyBtnDisabled] = useState(true)

    function handleAdminKeyVerification(){
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}admin/authentification`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                password : adminKey
            })
        }).then(data => data.json()).then(data => {
            if(data.data) {
                sessionStorage.setItem('adminToken' , data.data)
                dispatch(setAdminToken(data.data))
                dispatch(setAdminAuthentificationDialogWindow(false))
                pushNotification(data.message , token).catch(err => console.error(err))
                dispatch(setOnNotify(true))
                dispatch(setPushUpMessage(data.message))
                navigate('/adminhomepage')
            } else {
                console.log(data.message)
                setErr(data.message)
            }
        }).catch(error => {
            console.error(error)
            setErr(err.message)
        })
    }

    return(
        <>
            <div className='fixed inset-0 bg-gray-400 bg-opacity-60'>
                <div className="flex flex-col absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2
                                w-full xxs:w-80/100 xs:w-70/100 md:w-50/100 m-1 xxs:m-0
                                h-25/100 xs:h-35/100 bg-white items-center
                                text-xxxs xxs:text-xxs xs:text-sm sm:text-base">
                    <img src='/icos/leftstraightarrow.svg' 
                    className="symbol xxs:p-1 m-1 cursor-pointer self-start"
                    onClick={() => dispatch(setAdminAuthentificationDialogWindow(!adminAuthentificationDialogWindow))}/>
                    <div className="text-center font-bold text-xxs xxs:text-xs xs:text-base sm:text-lg">
                        Provide admin key
                    </div>
                    <div className="flex flex-col xs:flex-row items-center justify-center gap-1">
                        <input type="password" 
                            className="focus:outline-none p-1 xs:p-3 border"
                            onChange={(e) => {
                                setAdminKey(e.target.value)
                                if(e.target.value !== '') {
                                    setVerifyBtnDisabled(false)
                                } else {
                                    setVerifyBtnDisabled(true)
                                }
                            }}/>
                        <button className="relative p-1 xs:p-3 border" 
                            disabled={verifyBtnDisabled}
                            onClick={() => handleAdminKeyVerification()}>
                            authenticate
                            {verifyBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                        </button>
                    </div>
                    {err && <div className="text-center text-red-600">{err}</div>}
                </div>
            </div>
        </>
    )
}
export default AdminAuthentificationDialogWindow