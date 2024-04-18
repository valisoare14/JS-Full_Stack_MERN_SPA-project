import {useSelector , useDispatch } from 'react-redux'
import { deletePortfolio } from '../../api_s/deletePortfolio'
import { setPushUpMessage , setOnNotify , setPortfolioDeletionDialogWindow , setPortfolios} from '../../store/slices/slice'
import {pushNotification} from '../../api_s/pushNotification'

function PortfolioDeletionDialogWindow(props){
    const dispatch = useDispatch()
    const {portfolio} = props
    const portfolioDeletionDialogWindow = useSelector(state => state.global.portfolioDeletionDialogWindow)
    const portfolios = useSelector(state => state.global.portfolios)
    const token = useSelector(state => state.global.token)
    
    async function handlePortofolioDeletion(){
        try {
            deletePortfolio(token , portfolio._id).then(async data => {
                await pushNotification(data.message , token)
                dispatch(setOnNotify(true))
                dispatch(setPushUpMessage(data.message))
                dispatch(setPortfolios(portfolios.filter(el => el._id !=portfolio._id)))
                dispatch(setPortfolioDeletionDialogWindow(!portfolioDeletionDialogWindow))
            }).catch(err => console.error(err))
        } catch (error) {
            console.error(error)
        }
    }
    
    return(
        <div className='flex flex-col absolute inset-1/2 bg-white
            transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3 sm:h-1/2
            text-xxxs  xxs:text-xxs xs:text-xs sm:text-sm md:text-base'>
            <img src='/icos/leftstraightarrow.svg' className="symbol xxs:p-1 m-1 cursor-pointer" onClick={()=>dispatch(setPortfolioDeletionDialogWindow(!portfolioDeletionDialogWindow))}/>
            <div className='text-center pl-1 pr-1'>
                Are you sure you want to delete <span className='font-sans'>{`${portfolio.name}`}</span> portfolio ?
            </div>
            <div className='flex justify-around items-center flex-grow'>
                <button className='border rounded-md p-1 w-30/100 h-30/100 '
                    onClick={()=>dispatch(setPortfolioDeletionDialogWindow(!portfolioDeletionDialogWindow))}>
                    No
                </button>
                <button className='border rounded-md p-1 w-30/100 h-30/100 border-red-600'
                    onClick={async ()=>await handlePortofolioDeletion()}>
                    Yes
                </button>
            </div>
        </div>
    )
}

export default PortfolioDeletionDialogWindow