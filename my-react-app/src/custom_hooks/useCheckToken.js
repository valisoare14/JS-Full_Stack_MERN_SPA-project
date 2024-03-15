import { useEffect } from "react"
import { setToken,setLoading } from "../store/slices/slice"
import { useDispatch } from "react-redux"

function useCheckToken(){
    const dispatch=useDispatch()
    useEffect(()=>{
        async function checkToken(){
            try {
                const token=localStorage.getItem('token')
                if(token){
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}authentification/verifytoken`,{
                        method:"POST",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({token})
                    })
                    const result=await response.json()
                    if(response.status!=200){
                        localStorage.removeItem('token')
                        throw new Error(result.message)
                    }
                    return token  
                }
            } catch (error) {           
                console.error(error.message)
                return null
            }
        }
        checkToken().then(token=>{dispatch(setToken(token));dispatch(setLoading(false))}).catch(err=>console.error(err))
    },[])
}

export {useCheckToken}