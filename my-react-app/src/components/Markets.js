import AssetsList from "./AssetsList"
import { useSelector } from "react-redux"
import MarketsButton from "./layout/MarketsButton"
import {changeDateFormat} from '../utils/changeDateFormat'

function Markets(){
    const lastUpdate=useSelector(state=>state.global.lastUpdate)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)

    if(notificationCenter) {
        document.body.classList.add('overflow-y-hidden')
    } else {
        document.body.classList.remove('overflow-y-hidden')
    }

    return(
            <>
                <div className="flex items-center justify-around w-full rounded-tl-md rounded-tr-md text-black  text-xs  sm:text-base p-2 sm:p-4">
                    <p>Select market</p>
                    {lastUpdate&&<p>last update: {changeDateFormat(lastUpdate)}</p>}
                </div>
                <MarketsButton/>
                <AssetsList/>
            </>
    )
}
export default Markets