import {useSelector , useDispatch } from 'react-redux'
import { setPushUpMessage , setOnNotify , setPortfolioAssetDeletionDialogWindow ,setPortfolioAssets ,setPortfolioAssetsFullDetails} from '../../store/slices/slice'
import {pushNotification} from '../../api_s/pushNotification'
import { deletePortfolioAsset } from '../../api_s/deletePortfolioAsset'

function PortfolioAssetDeletionDialogWindow({portfolioAsset}){
    const dispatch = useDispatch()
    const token = useSelector(state => state.global.token)
    const portfolioAssets = useSelector(state => state.global.portfolioAssets)
    const portfolioAssetsFullDetails = useSelector(state => state.global.portfolioAssetsFullDetails)
    const portfolioAssetDeletionDialogWindow = useSelector(state => state.global.portfolioAssetDeletionDialogWindow)
    
    
    async function handlePortfolioAssetDeletion() {
        try {
            const result = await deletePortfolioAsset(token , portfolioAsset._id , portfolioAsset.symbol)
            await pushNotification(result.message , token)
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(result.message))
            const portfolioAssetsFiltered = portfolioAssets.filter(pa => pa._id !== portfolioAsset._id)
            dispatch(setPortfolioAssets(portfolioAssetsFiltered))
            dispatch(setPortfolioAssetsFullDetails(portfolioAssetsFullDetails.filter(el => portfolioAssetsFiltered.find(e => e.symbol === el.symbol && e.market === el.market) ? true : false)))
            dispatch(setPortfolioAssetDeletionDialogWindow(!portfolioAssetDeletionDialogWindow))
        } catch (error) {
            console.error(error)
        }
    }
    
    return(
        <div className='flex flex-col absolute inset-1/2 bg-white
            transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3 sm:h-1/2
            text-xxxs  xxs:text-xxs xs:text-xs sm:text-sm md:text-base'>
            <img src='/icos/leftstraightarrow.svg' className="symbol xxs:p-1 m-1 cursor-pointer" 
                onClick={()=>dispatch(setPortfolioAssetDeletionDialogWindow(!portfolioAssetDeletionDialogWindow))}/>
            <div className='text-center pl-1 pr-1'>
                Are you sure you want to delete <span className='font-sans'>{`${portfolioAsset.name}`}</span> from portfolio ?
            </div>
            <div className='flex justify-around items-center flex-grow'>
                <button className='border rounded-md p-1 w-30/100 h-30/100 '
                    onClick={()=>dispatch(setPortfolioAssetDeletionDialogWindow(!portfolioAssetDeletionDialogWindow))}>
                    No
                </button>
                <button className='border rounded-md p-1 w-30/100 h-30/100 border-red-600'
                    onClick={async ()=>await handlePortfolioAssetDeletion()}>
                    Yes
                </button>
            </div>
        </div>
    )
}

export default PortfolioAssetDeletionDialogWindow