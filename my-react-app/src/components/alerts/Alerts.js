import Alert from "./Alert"
import AlertsHistory from "./AlertsHistory"
import { useSelector } from "react-redux"

function Alerts() {

    const menu = useSelector(state => state.global.menu)

    return(
        <div className={`flex flex-col ${menu ? 'md:flex-row' : 'sm:flex-row'} absolute top-1/2 transform -translate-y-1/2 max-w-full text-xs sm:text-base`}>
            <Alert/>
            <AlertsHistory/>
        </div>
    )
}

export default Alerts