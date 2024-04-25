import { useEffect } from "react"
import { setAdminToken} from "../store/slices/slice"
import { useDispatch } from "react-redux"

function useCheckAdminToken() {
    const dispatch=useDispatch()
    useEffect(()=>{
       const adminToken = sessionStorage.getItem('adminToken')
       if(adminToken) {
        let response = null
            fetch(`${process.env.REACT_APP_LOCAL_SERVER}admin/verifytoken`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    token : adminToken
                })
            }).then(response_ => {
                response = response_
                return response_.json()
            }).then(result => {
                if(!response.ok) {
                    sessionStorage.removeItem('adminToken')
                    dispatch(setAdminToken(null))
                } else{
                    dispatch(setAdminToken(adminToken))
                }
            }).catch(err => console.error(err))
       }
    },[])
}

export {useCheckAdminToken}