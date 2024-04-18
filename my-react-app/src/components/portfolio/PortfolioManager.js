import {useEffect, useState} from 'react'
import {useSelector , useDispatch } from 'react-redux'
import { getUserPortfolios } from '../../api_s/getUserPortfolios'
import { setPortfolios , setSelectedPortfolio , setPortfolioDeletionDialogWindow , setPortfolioCreationWindow} from '../../store/slices/slice'
import PortfolioDeletionDialogWindow from './PortfolioDeletionDialogWindow'
import PortfolioCreationWindow from '../PortfolioCreationWindow'

function PortfolioManager(){
    const dispatch = useDispatch()
    const token = useSelector(state => state.global.token)
    const portfolioCreationWindow = useSelector(state => state.global.portfolioCreationWindow)
    const portfolios = useSelector(state => state.global.portfolios)
    const portfolioDeletionDialogWindow = useSelector(state => state.global.portfolioDeletionDialogWindow)
    const selectedPortfolio = useSelector(state => state.global.selectedPortfolio)
    const [selectedPortfolioId , setSelectedPortfolioId] = useState(null)
    const [desiredPortfolioForDeletion , setDesiredPortfolioForDeletion] = useState(null)
    

    useEffect(()=>{
        if(selectedPortfolio) {
            setSelectedPortfolioId(selectedPortfolio._id)
        }
        getUserPortfolios(token).then(data => {
            dispatch(setPortfolios(data))
        }).catch(err => console.error(err))
    },[])

    useEffect(()=>{
        if(!selectedPortfolio){
            setSelectedPortfolioId(null)
        }
    },[portfolios , selectedPortfolio])


    return(
        <div className="flex flex-col items-center text-xxxs xxs:text-xxs xs:text-xs sm:text-sm border-b-2">
            <div className="flex flex-row justify-between w-full p-4">
               <p className='font-mono w-1/2 text-sm xxs:text-base xs:text-lg sm:text-xl font-bold'>
                    My portfolios
               </p>
               <img src='/icos/plus-blue.svg' className='symbol cursor-pointer' onClick={()=> dispatch(setPortfolioCreationWindow(true))}/>
            </div>
            <ul className='font-mono w-full'>
                {portfolios.map(p => <li key={p._id} 
                    className={`flex justify-between ${p._id == selectedPortfolioId && 'bg-sky-300'} p-4 text-xxs xs:text-sm sm:text-base`}>
                    <div className={`cursor-pointer `} 
                        onClick={()=>{
                            dispatch(setSelectedPortfolio(p))
                            setSelectedPortfolioId(p._id)
                        }}
                    >
                        {p.name}
                    </div>
                    <div>
                        <img src='/icos/bin.png' className='symbol cursor-pointer' onClick={()=>{
                            setDesiredPortfolioForDeletion(p)
                            dispatch(setPortfolioDeletionDialogWindow(true))
                        }}/>
                    </div>
                    
                </li>)}
            </ul>
            {portfolioDeletionDialogWindow && <>
                <div className='absolute inset-0 bg-gray-400 bg-opacity-60'></div>
                <PortfolioDeletionDialogWindow portfolio={desiredPortfolioForDeletion}/>
            </>}
            {portfolioCreationWindow && <>
                <div className='absolute inset-0 bg-gray-400 bg-opacity-60'></div>
                <PortfolioCreationWindow portfolioCreationIntention={true}/>
            </>
            }
        </div>
    )
}

export default PortfolioManager