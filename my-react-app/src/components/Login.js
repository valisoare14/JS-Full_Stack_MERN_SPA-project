import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { setOnNotify} from '../store/slices/slice'
import { useDispatch } from 'react-redux'
import { pushNotification } from '../api_s/pushNotification'
import { setToken } from '../store/slices/slice'

function Login(){
    const [email,setEmail]=useState(null)
    const [password,setPassword]=useState(null)
    const [error,setError]=useState(null)
    const navigate=useNavigate()
    const dispatch=useDispatch()

    async function handleSubmit(e){
        e.preventDefault()
        try {
            const response=await fetch(`${process.env.REACT_APP_LOCAL_SERVER}authentification`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'email':email,
                    'password':password
                })
            })
            const data=await response.json()
            if(response.status!=200){
                throw new Error(data.message)
            }
            localStorage.setItem('token',data.data)
            dispatch(setToken(data.data))
            await pushNotification(data.message , localStorage.getItem('token'))
            dispatch(setOnNotify(true))
            navigate('/',{replace:true})
        } catch (err) {
            setError(err)
            console.error(err)
        }

    }
    return(
        <div className="flex items-center justify-center h-screen ">
            <div className="w-216 h-96 flex rounded-3xl">
                <div className="w-2/5 flex flex-col items-center justify-center bg-green-600 rounded-tl-3xl rounded-bl-3xl">
                   <p className='mb-8 text-2xl text-white'>Don't have an account ?</p>
                   <Link to='/register'>
                        <button className='border rounded-xl p-2 bg-white hover:bg-gray-400'>
                            Create account
                        </button>
                   </Link>
                   
                </div>
                <div className="w-3/5 rounded-tr-3xl rounded-br-3xl bg-sky-500 flex flex-col justify-center items-center">
                    <form className='flex flex-col items-center' onSubmit={handleSubmit}>
                        <p className='mb-8 text-2xl text-white'>Login into account</p>
                        <input required type='email' placeholder='email' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setEmail(e.target.value)}/>
                        <input required type='password' placeholder='password' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setPassword(e.target.value)}/>
                        {error&&<div className='rounded-sm bg-red-400 w-64 h-8 m-3 border text-center border border-red-800' >{error.message}</div>}
                        <button type='submit' className='border rounded-xl p-2 bg-white hover:bg-gray-400 w-32 mt-5'>
                            Login
                        </button>
                    </form>
                </div>
            </div>
                
        </div>
    )
}
export default Login

//h-screen => 100% din inaltimea viewoport-ului
//w-full => 100% din latimea parintelui(trb explicit specificata)

//navigate('/',{replace:true}) - impiedica utilizatorul sa ajunga din nour la 
//formularul de logare , in caz ca de pe butonul <- de back
//(ruta '/login' este inlocuita in istoricul de navigare cu noua ruta - noua ruta nu se adauga peste)

//'e.preventDefault()'
//impiedica elementul 'form' din reincarcarea paginii dupa completarea formularului