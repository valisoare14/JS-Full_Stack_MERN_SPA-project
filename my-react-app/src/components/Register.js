import { useState } from "react"
import { Link } from "react-router-dom"

function Register(){
    const [email,setEmail]=useState(null)
    const [password,setPassword]=useState(null)
    const [firstName,setFirstName]=useState(null)
    const [lastName,setLastName]=useState(null)
    const[error,setError]=useState(null)
    const [succesfullMessage,setSuccesfullMessage]=useState(null)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const response=await fetch(`${process.env.REACT_APP_LOCAL_SERVER}users`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            })
            const data=await response.json()
            if(response.status!=201){
                throw new Error(data.message)
            }
            setSuccesfullMessage(data)
        } catch (err) {
            setError(err)
            console.error(err)
        }
    }
    return(
        <div className="flex items-center justify-center h-screen ">
            <div className="w-216 h-96 flex rounded-3xl">
                <div className="w-3/5 rounded-tl-3xl rounded-bl-3xl bg-sky-500 flex flex-col justify-center items-center">
                    <form className='flex flex-col items-center' onSubmit={handleSubmit}>
                        <p className='mb-8 text-2xl text-white'>Register account</p>
                        <input type='text' required placeholder='first name' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setFirstName(e.target.value)}/>
                        <input type='text' required placeholder='last name' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setLastName(e.target.value)}/>
                        <input type='email' required placeholder='email' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setEmail(e.target.value)}/>
                        <input type='password' required placeholder='password' className='m-3 w-64 h-8 rounded-md focus:outline-none pl-1' onChange={(e)=>setPassword(e.target.value)}/>
                        {error&&<div className='rounded-sm bg-red-400 w-64 m-3 border text-center border border-red-800' >{error.message}</div>}
                        {succesfullMessage&&<div className='rounded-sm bg-green-400 w-64 m-3 border text-center border border-green-800' >{succesfullMessage.message}</div>}
                        <button type='submit' className='border rounded-xl p-2 bg-white hover:bg-gray-400 w-32 mt-5'>
                           Register
                        </button>
                    </form>
                </div>
                <div className="w-2/5 flex flex-col items-center justify-center bg-green-600 rounded-tr-3xl rounded-br-3xl">
                    <p className='mb-8 text-2xl text-white'>Have an account ?</p>
                    <Link to='/login'>
                        <button className='border rounded-xl p-2 bg-white hover:bg-gray-400 w-32'>
                            Login
                        </button>
                    </Link>
                </div>
            </div>
         </div>
    )
}
export default Register;