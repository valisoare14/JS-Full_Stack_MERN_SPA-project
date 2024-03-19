import { useDispatch , useSelector } from "react-redux"
import { setPushUpMessage } from "../../store/slices/slice"
import { useEffect } from "react"

function PushupNotification() {
    const dispatch = useDispatch()
    const pushUpMessage = useSelector(state=>state.global.pushUpMessage)

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setPushUpMessage(''));
        }, 3000);

        return () => clearTimeout(timer);
    }, [dispatch]);
    
    return(
        <div className="flex items-center absolute transform top-1 left-1/2 -translate-x-1/2 bg-white text-xxs sm:text-base rounded-sm notification-slide-down">
           <img src='/icos/dot-red.svg' className="symbol" />
           <p className="flex-grow p-1 pr-2 border-r border-grey-600 max-h-full">{pushUpMessage}</p>
           <img src='/icos/x.svg' className="w-6 cursor-pointer p-2" onClick={()=> dispatch(setPushUpMessage(''))}/>
        </div>
    )
}

export default PushupNotification