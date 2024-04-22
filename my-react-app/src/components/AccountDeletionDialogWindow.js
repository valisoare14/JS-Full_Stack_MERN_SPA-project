import {useSelector , useDispatch } from 'react-redux'
import { setAccountDeletionDialogWindow , setMenu , setToken} from '../store/slices/slice'
import { deleteNotifications } from '../api_s/deleteNotifications'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { verifyOldPassword } from '../api_s/verifyOldPassword'

function AccountDeletionDialogWindow(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accountDeletionDialogWindow = useSelector(state => state.global.accountDeletionDialogWindow)
    const token = useSelector(state => state.global.token)

    const [allowDeletion , setAllowDeletion] = useState(false)
    const [verifyBtnDisabled , setVerifiedBtnDisabled] = useState(true)
    const [password , setPassword] = useState('')
    const [error , setError] = useState(null)
    const [allowAccountDeletion , setAllowAccountDeletion] = useState(false)

    function handleLogout(){
        dispatch(setMenu(false))
        sessionStorage.removeItem('token')
        dispatch(setToken(sessionStorage.getItem('token')))
        navigate('/login',{
            replace:true
        })
    }

    async function handlePasswordVerification(){
        try {
            verifyOldPassword(token , password).
            then(data => {
                if(data.success === true) {
                    setAllowAccountDeletion(true)
                } else {
                    setAllowAccountDeletion(false)
                    setError(data.message)
                }
            })
        } catch (error) {
            console.error(error)    
        }
    }

    async function handleAccountDeletion(){
        try {
            await deleteNotifications(token)
            await fetch(`${process.env.REACT_APP_LOCAL_SERVER}watchlist/deleteall`,{
                method : 'DELETE',
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            await fetch(`${process.env.REACT_APP_LOCAL_SERVER}alarms/deleteall`,{
                method : 'DELETE',
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            await fetch(`${process.env.REACT_APP_LOCAL_SERVER}portfolio/deleteall`,{
                method : 'DELETE',
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            await fetch(`${process.env.REACT_APP_LOCAL_SERVER}users`,{
                method : 'DELETE',
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            handleLogout()
        } catch (error) {
            console.error(error)
        }
    }
    
    return(
        <div className='flex flex-col absolute inset-1/2 bg-white
            transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3 sm:h-1/2
            text-xxxs  xxs:text-xxs xs:text-xs sm:text-sm md:text-base'>
            <img src='/icos/leftstraightarrow.svg' className="symbol xxs:p-1 m-1 cursor-pointer" onClick={()=>dispatch(setAccountDeletionDialogWindow(!accountDeletionDialogWindow))}/>
            {!allowDeletion && <div className='text-center pl-1 pr-1'>
                Are you sure you want to delete your account ?
            </div>}
            <div className='flex justify-around items-center flex-grow'>
                { !allowDeletion ? <>
                    <button className='border rounded-md p-1 w-30/100 h-30/100'
                        onClick={() => dispatch(setAccountDeletionDialogWindow(!accountDeletionDialogWindow))}>
                        No
                    </button>
                    <button className='border rounded-md p-1 w-30/100 h-30/100 border-red-600'
                        onClick={() => setAllowDeletion(!allowDeletion)}>
                        Yes
                    </button>
                </>
                :
                <div className='flex flex-col items-center justify-center'>
                    <div className="flex flex-col xs:flex-row justify-between items-center">
                        <input type="password" className="focus:outline-none border p-1 xs:mt-0 w-16 xxs:w-auto" placeholder='enter password'
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if(e.target.value !== ''){
                                    setVerifiedBtnDisabled(false)
                                } else{
                                    setVerifiedBtnDisabled(true)
                                }
                            }}/>
                        <button disabled={verifyBtnDisabled}
                            className='relative border  p-1  mt-1 xs:mt-0 w-10 xxs:w-auto'
                            onClick={async () => await handlePasswordVerification()}>
                            verify
                            {verifyBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                        </button>
                    </div>
                    {error && <div className="text-red-600 text-center">{error}</div>}
                    {allowAccountDeletion &&
                    <button className='bg-red-600 text-white mt-1 sm:mt-3 rounded-md w-full  xxs:w-1/2 p-1'
                        onClick={async () => await handleAccountDeletion()}>
                        delete
                    </button>}
                </div>}
            </div>
        </div>
    )
}

export default AccountDeletionDialogWindow