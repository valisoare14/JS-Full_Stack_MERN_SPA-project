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
                } else if(localStorage.getItem('token')) {
                   const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}cleardatabase`,{
                        method:"DELETE",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem('token')
                        })
                   })
                   const result = await response.json()
                   if(!response.ok) {
                        throw new Error(result.message)
                   }
                }
            } catch (error) {           
                console.error(error.message)
            }
        }
        checkToken().then(()=>dispatch(setLoading(false))).catch(err=>console.error(err))
    },[])
}

export {useCheckToken}