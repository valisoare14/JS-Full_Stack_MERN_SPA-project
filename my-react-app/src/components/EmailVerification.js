import { useParams , Link} from "react-router-dom"
import { useEffect,useState } from "react"

function EmailVerification(){
    const params=useParams()
    const [msg,setMsg]=useState('')
    const [status,setStatus]=useState(200)
    useEffect(()=>{
        const verifyUrl=async()=>{
            try {
                const response=await fetch(`${process.env.REACT_APP_LOCAL_SERVER}users/verify/${params.id}/${params.token}`)
                const data=await response.json()
                setMsg(data.message)
                setStatus(response.status)
            } catch (error) {
                console.error(error.message)
            }
        }
        verifyUrl()
    },[params])
    return(
        <div className="h-screen flex items-center justify-center">
            <div className={`h-64 w-96 flex flex-col items-center justify-center bg-${status==200?'green':'red'}-400 rounded-xl`}>
                {
                    status==200
                    && 
                    <Link to='/login'>
                        <button type="button" className="border border-2 rounded-lg w-72 border-green-800 bg-green-200 p-2 m-2 text-lg">
                            Login
                        </button>
                    </Link>
                }
                <p className="m-4 p-2 text-white text-xl">
                    {msg}
                </p>
            </div>
        </div>
    )
}

export default EmailVerification