import AdminMenuItems from "./AdminMenuItems"
import {useState} from 'react'
import MarketSymbols from "./MarketSymbols"

function AdminHomepage(){
    const [selectedMenuItemId , setSelectedMenuItemId] = useState('')

    return(
        <>
            <AdminMenuItems selectedMenuItemId={selectedMenuItemId} setSelectedMenuItemId={setSelectedMenuItemId}/>
            {selectedMenuItemId == 1 &&
            <MarketSymbols/>
            }
        </>
    )
}

export default AdminHomepage