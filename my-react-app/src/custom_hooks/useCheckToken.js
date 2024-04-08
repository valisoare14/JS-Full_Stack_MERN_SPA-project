import { useEffect } from "react"
import { setLoading , setToken} from "../store/slices/slice"
import { useDispatch } from "react-redux"

function useCheckToken() {
    const dispatch=useDispatch()
    useEffect(()=>{
        async function checkToken(){
            try {
                const token=sessionStorage.getItem('token')
                if(token){
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}authentification/verifytoken`,{
                        method:"POST",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({token})
                    })
                    const result=await response.json()
                    if(response.status!=200){
                        sessionStorage.removeItem('token')
                        dispatch(setToken(null))
                        throw new Error(result.message)
                    }
                    dispatch(setToken(token))
                    return
                }
            } catch (error) {           
                console.error(error.message)
            }
        }
        checkToken().then(()=>dispatch(setLoading(false))).catch(err=>console.error(err))
    },[])
}

export {useCheckToken}