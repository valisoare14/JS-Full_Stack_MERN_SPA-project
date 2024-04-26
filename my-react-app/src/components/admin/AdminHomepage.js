import AdminMenuItems from "./AdminMenuItems"
import {useState} from 'react'
import MarketSymbols from "./MarketSymbols"
import Analysis from "./Analysis"

function AdminHomepage(){
    const [selectedMenuItemId , setSelectedMenuItemId] = useState('')

    return(
        <>
            <AdminMenuItems selectedMenuItemId={selectedMenuItemId} setSelectedMenuItemId={setSelectedMenuItemId}/>
            {selectedMenuItemId == 1 &&
            <MarketSymbols/>
            }
            {selectedMenuItemId == 3 && 
            <Analysis/>
            }
        </>
    )
}

export default AdminHomepage