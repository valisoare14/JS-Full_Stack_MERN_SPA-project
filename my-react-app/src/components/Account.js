import { useEffect , useState } from "react";
import { useSelector , useDispatch} from "react-redux";
import Spinner from './layout/Spinner'
import { verifyOldPassword } from "../api_s/verifyOldPassword";
import { setOnNotify , setPushUpMessage} from '../store/slices/slice'
import { pushNotification } from '../api_s/pushNotification'
import { setAccountDeletionDialogWindow } from "../store/slices/slice";
import AccountDeletionDialogWindow from "./AccountDeletionDialogWindow";

function Account(){
    const dispatch = useDispatch()
    const token = useSelector(state => state.global.token)
    const accountDeletionDialogWindow = useSelector(state => state.global.accountDeletionDialogWindow)
    const [userInfo , setUserInfo] = useState(null)
    const [loading , setLoading] = useState(false)
    const [changePassword , setChangePassword] = useState(false)
    const [allowPasswordModification , setAllowPasswordModification] = useState(false)
    const [verifyBtnDisabled , setVerifiedBtnDisabled] = useState(true)
    const [saveBtnDisabled , setSaveBtnDisabled] = useState(true)
    const [error , setError] = useState(null)
    const [oldPassword , setOldPassword] = useState('')
    const [newPasswordOne , setNewPasswordOne] = useState('')
    const [newPasswordTwo , setNewPasswordTwo] = useState('')

    async function handlePasswordVerification(){
        try {
            verifyOldPassword(token , oldPassword).
            then(data => {
                if(data.success === true) {
                    setAllowPasswordModification(true)
                } else {
                    setAllowPasswordModification(false)
                    setError(data.message)
                }
            })
        } catch (error) {
            console.error(error)    
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        try {
            if(newPasswordOne !== newPasswordTwo){
                setError('Passwords not matching!')
            } else{
            fetch(`${process.env.REACT_APP_LOCAL_SERVER}account/changepassword`,{
                method : 'PUT',
                headers : {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    password : newPasswordTwo
                })
            }).then(data => data.json()).then(async data => {
                if(data.success) {
                    setChangePassword(false)
                    setAllowPasswordModification(false)
                    setNewPasswordOne('')
                    setNewPasswordTwo('')
                    setOldPassword('')
                    await pushNotification(data.message , token)
                    dispatch(setOnNotify(true))
                    dispatch(setPushUpMessage(data.message))
                } else{
                    setError(data.message)
                }
            })
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(()=>{
        setLoading(true)
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}users/user`,{
          method : 'GET',
          headers : {
            "Authorization" : `Bearer ${token}`
          }
        }).then(data => data.json()).then(data => {
            setUserInfo(data.data)
            setLoading(false)
        }).
        catch(err =>{
            console.error(err)
            setLoading(false)
        })
    },[])

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setError(null)
        },3000)
        return () => clearTimeout(timeout)
    },[error])

    return(
        <>
        {!loading && userInfo  ? 
            <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2
                            w-full h-80 sm:h-90 justify-evenly p-8 xs:p-0 font-mono
                            text-xxxs xxs:text-xxs xs:text-xs sm:text-sm md:text-base
                            flex flex-col xs:flex-row">
                <div className="flex flex-col gap-1 border p-3 justify-between">
                    <div className="">
                        <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg font-bold w-full  xs:w-40/100">
                            Account details
                        </div>
                        <div>First Name: {userInfo.firstName}</div>
                        <div>Last Name: {userInfo.lastName}</div>
                        <div>Email: {userInfo.email}</div>
                    </div>
                    <button className="bg-red-600 border text-center rounded-md p-1 text-white w-1/2 xs:w-auto"
                        onClick={() => dispatch(setAccountDeletionDialogWindow(!accountDeletionDialogWindow))}>
                        delete my <br className="block xxs:hidden"/>account
                    </button>
                </div>
                <div className="flex-col w-full  xs:w-40/100 border p-3">
                    <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg font-bold mb-1">
                        Password
                    </div>
                    <button className="border rounded-md mb-1 p-1 w-full xxs:w-20" onClick={() => setChangePassword(!changePassword)}>
                        {changePassword ? 'exit' : 'change password'}
                    </button>
                    {changePassword &&
                    <div className="flex-col xs:flex-row mt-5">
                        <div className="inline-flex mb-1">Please introduce your old password</div>
                        <div className="flex flex-col xs:flex-row justify-between mb-5">
                            <input type="password" onChange={(e) => {
                                setOldPassword(e.target.value)
                                if(e.target.value != '') {
                                    setVerifiedBtnDisabled(false)
                                } else {
                                    setVerifiedBtnDisabled(true)
                                }
                                }
                            } className="focus:outline-none border p-1 w-full xxs:w-58/100"/>
                            <button className='relative border rounded-md p-1 w-full xxs:w-20 mt-1 xs:mt-0' disabled={verifyBtnDisabled}
                                onClick={async () =>await handlePasswordVerification()}>
                                verify
                                {verifyBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                            </button>
                        </div>
                        {allowPasswordModification &&
                            <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                                <h1>Introduce your new password</h1>
                                <input value={newPasswordOne} type="password" placeholder="type"
                                    className="focus:outline-none border p-1 w-full xxs:w-58/100"
                                    onChange={(e)=>{
                                        setNewPasswordOne(e.target.value)
                                        if(e.target.value !== '' && newPasswordTwo!==''){
                                            setSaveBtnDisabled(false)
                                        } else {
                                            setSaveBtnDisabled(true)
                                        }
                                }}/>
                                <input value={newPasswordTwo} type="password" placeholder="type again"
                                    className="focus:outline-none border p-1 w-full xxs:w-58/100"
                                    onChange={(e)=>{
                                        setNewPasswordTwo(e.target.value)
                                        if(e.target.value !== '' && newPasswordOne!==''){
                                            setSaveBtnDisabled(false)
                                        } else {
                                            setSaveBtnDisabled(true)
                                        }
                                }}/>
                                <button type="submit" className="relative border rounded-md p-1 w-full xxs:w-20" disabled={saveBtnDisabled}>
                                    save
                                    {saveBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                                </button>
                            </form> 
                        }
                        {error && <div className="text-red-600 text-center">{error}</div>}
                    </div>
                    }
                </div>
            </div> :
            <Spinner loading={loading}/>
            }
            {accountDeletionDialogWindow && <> 
                <div className='absolute inset-0 bg-gray-400 bg-opacity-60'></div>
                <AccountDeletionDialogWindow/>
            </>}
        </>
    )
}
export default Account;