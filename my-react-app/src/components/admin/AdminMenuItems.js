function AdminMenuItems({selectedMenuItemId , setSelectedMenuItemId}){
    
    return(
        <div className="flex font-mono text-white w-full  text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
            <button id={1} className={`flex-grow ${ selectedMenuItemId == 1 ? 'bg-green-400' : 'bg-green-600'}  hover:bg-green-400`}
                onClick={(e) => setSelectedMenuItemId(e.target.id)}>Market Symbols</button>
            <button id={2} className={`flex-grow ${ selectedMenuItemId == 2 ? 'bg-green-400' : 'bg-green-600'}  hover:bg-green-400`}
                onClick={(e) => setSelectedMenuItemId(e.target.id)}>Educational Content</button>
            <button id={3} className={`flex-grow ${ selectedMenuItemId == 3 ? 'bg-green-400' : 'bg-green-600'}  hover:bg-green-400`}
                onClick={(e) => setSelectedMenuItemId(e.target.id)}>Analysis</button>
        </div>
    )
}

export default AdminMenuItems