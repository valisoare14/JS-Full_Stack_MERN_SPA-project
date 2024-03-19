import AssetsList from "./AssetsList"
import { useSelector } from "react-redux"
import MarketsButton from "./layout/MarketsButton"

function Markets(){
    const lastUpdate=useSelector(state=>state.global.lastUpdate)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)

    if(notificationCenter) {
        document.body.classList.add('overflow-y-hidden')
    } else {
        document.body.classList.remove('overflow-y-hidden')
    }

    function changeDateFormat(stringDate) {
        const date = new Date(stringDate)
        const year=date.getFullYear().toString()
        const month=(date.getMonth()+1).toString().padStart(2,'0')
        const day=date.getDate().toString().padStart(2,'0')
        const hour = date.getHours().toString().padStart(2,'0')
        const minutes = date.getMinutes().toString().padStart(2,'0')

        return `${year}-${month}-${day}  ${hour}:${minutes}`
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