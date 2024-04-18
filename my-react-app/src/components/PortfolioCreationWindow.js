import { useSelector , useDispatch } from "react-redux"
import { setPortfolioCreationWindow , setPortfolios } from "../store/slices/slice"
import { createPortfolio } from "../api_s/createPortfolio"
import { useEffect, useState } from "react"
import { pushNotification } from "../api_s/pushNotification"
import { setOnNotify , setPushUpMessage } from "../store/slices/slice"

function PortfolioCreationWindow(props){
    const {portfolioCreationIntention} = props
    const [name , setName] = useState('')
    const portfolioCreationWindow = useSelector(state => state.global.portfolioCreationWindow)
    const portfolios = useSelector(state => state.global.portfolios)
    const token = useSelector(state => state.global.token)
    const [err , setErr] = useState(undefined)
    const dispatch = useDispatch()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await createPortfolio(token , name)

            if(!response.data) {
                setErr(response.message)
            } else {
                dispatch(setPortfolioCreationWindow(!portfolioCreationWindow))
                dispatch(setPortfolios([...portfolios , response.data]))
            }
            await pushNotification(response.message , token)
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(response.message))

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setErr(undefined)
        },3000)

        return () => clearInterval(timer)
    },[err])

    return(
        <div className="absolute inset-1/2 flex-col items-center w-4/5 xxs:w-3/5 h-2/5 sm:h-3/5
            transform -translate-x-1/2 -translate-y-1/2 
            bg-white font-mono text-xxs sm:text-sm">
            <div className="flex">
                <img src='/icos/leftstraightarrow.svg' className="symbol xxs:p-1 m-1 cursor-pointer" 
                    onClick={()=>dispatch(setPortfolioCreationWindow(!portfolioCreationWindow))}/>
            </div>
            {!portfolioCreationIntention &&
            <div>
                <span className="text-xs sm:text-lg">&nbsp;&nbsp;Uups ! <br/></span>
                &nbsp;It looks like you don't have a portfolio.<br/>
                &nbsp;Please create one before starting to manage you favorite assets
            </div>}
            <form className="flex flex-col xs:flex-row xs:items-end justify-center xs:justify-around xs:mt-10"
                onSubmit={handleSubmit}>
                <div>
                    <div className="font-bold text-xs sm:text-lg">
                        &nbsp;Create portfolio
                    </div>
                    <input required type="text" className="border focus:outline-none pl-1 rounded-sm ml-1 mt-1 xs:mt-2 sm:mt-3 h-6 sm:h-10 w-auto sm:w-80" placeholder="enter portfolio name"
                        onChange={(e) => setName(e.target.value)}/>
                </div>
                <button type="submit" className="border rounded-sm bg-sky-600 text-white p-2 pl-3 pr-3 w-16 xs:w-auto m-1 xxs:m-2 xs:m-0">
                    create
                </button>
            </form>
           {err && <div className="text-center text-red-600 xs:mt-2">{err}</div>}

        </div>
    )
}

export default PortfolioCreationWindow