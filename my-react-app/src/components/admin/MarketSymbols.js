import { useEffect, useState } from "react"
import {useSelector , useDispatch} from 'react-redux'
import {pushNotification} from '../../api_s/pushNotification'
import {setOnNotify , setPushUpMessage} from '../../store/slices/slice'

function MarketSymbols(){
    const dispatch = useDispatch()
    const adminToken = useSelector(state => state.global.adminToken)
    const token = useSelector(state => state.global.token)
    const [availableSymbols , setAvailableSymbols] = useState({})
    const [visibleSymbols , setVisibleSymbols] = useState({})
    const [initialVisibleSymbols , setInitialVisibleSymbols] = useState({})
    const [collection , setCollection] = useState('stocks')
    const [loading , setLoading] = useState(false)
    const [saveBtnDisabled , setSaveBtnDisabled] = useState(true)

    function handleAdminSymbolsRecovery(){
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}adminsymbols/all`,{
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${adminToken}`
            }
        }).then(response => {
            if(!response.ok){
                return response.json().then(result => {
                    throw new Error(result.message)
                })
            }
            return response.json()
        }).then(result => {
            pushNotification(result.message , token).catch(err => console.error(err))
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(result.message))
            setInitialVisibleSymbols(result.data)
            setVisibleSymbols(result.data)
        }).catch(err => console.error(err))
    }

    function handleVisibleSymbolsUpdate(){
        fetch(`${process.env.REACT_APP_LOCAL_SERVER}adminsymbols`,{
            method : 'PUT',
            headers : {
                'Authorization' : `Bearer ${adminToken}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({newObject : visibleSymbols})
        }).then(response => {
            if(!response.ok){
                return response.json().then(result => {
                    throw new Error(result.message);
                });
            }
            setInitialVisibleSymbols(visibleSymbols)
            return response.json()
        }).then(result => {
            pushNotification(result.message , token).catch(err => console.error(err))
            dispatch(setOnNotify(true))
            dispatch(setPushUpMessage(result.message))
        }).catch(err => console.error(err))
    }

    function checkVisibleSymbolsUpdate(){
        let modified = initialVisibleSymbols[collection].symbols.
            reduce((s,el) => s*= visibleSymbols[collection].symbols.includes(el), true) 
            * 
                visibleSymbols[collection].symbols.
            reduce((s,el) => s*=initialVisibleSymbols[collection].symbols.includes(el) , true)

        if(modified == 0) {
            return true
        } else {
            return false
        }
    }

    function handleAddSymbol(el){
        setVisibleSymbols({
            ...visibleSymbols,
            [collection] : {
                ...visibleSymbols[collection],
                symbols : [...visibleSymbols[collection].symbols , el]
            }
        })
    }

    function handleRemoveSymbol(el){
        setVisibleSymbols({
            ...visibleSymbols,
            [collection] : {
                ...visibleSymbols[collection],
                symbols : visibleSymbols[collection].symbols.filter(s => s !== el)
            }
        })
    }

    useEffect(()=>{
        setLoading(true)
        async function fetchSymbols(){

            fetch(`${process.env.REACT_APP_LOCAL_SERVER}adminsymbols/all`,{
                method : 'GET',
                headers : {
                    'Authorization' : `Bearer ${adminToken}`
                }
            }).then(response => {
                if(!response.ok){
                    return response.json().then(result => {
                        throw new Error(result.message)
                    }) 
                }
                return response.json()
            }).then(result => setAvailableSymbols(result.data)).catch(err => console.error(err))

            fetch(`${process.env.REACT_APP_LOCAL_SERVER}adminsymbols/all/visible`,{
                method : 'GET',
                headers : {
                    'Authorization' : `Bearer ${adminToken}`
                }
            }).then(response => {
                if(!response.ok){
                    return response.json().then(result => {
                        throw new Error(result.message)
                    }) 
                }
                return response.json()
            }).then(result => {
                setVisibleSymbols(result.data)
                setInitialVisibleSymbols(result.data)
            }).catch(err => console.error(err))
        }
        fetchSymbols().then(() => setLoading(false)).catch(err => console.error(err))
    },[])

    useEffect(()=>{
        if(visibleSymbols[collection] && initialVisibleSymbols[collection]){
            if(checkVisibleSymbolsUpdate()){
                setSaveBtnDisabled(false)
            } else{
                setSaveBtnDisabled(true)
            }
        }
    },[visibleSymbols , initialVisibleSymbols])


    return(
        <>
        <div className="flex flex-col xs:flex-row w-full justify-between">
            <div className="inline-flex font-mono flex-col m-1 xs:m-3 w-auto text-xxxs xxs:text-xxs xs:text-xs sm:text-sm md:text-md lg:text-lg p-3">
                <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold">Select market:</div>
                <select className="focus:outline-none border rounded-md p-1 xs:p-3"
                    onChange={(e) => setCollection(e.target.value)}>
                    <option>stocks</option>
                    <option>cryptocurrencies</option>
                    <option>commodities</option>
                </select>
            </div>
            <div className="flex flex-col m-1 xs:m-3 items-center border p-3 rounded-md mb-4 xs:mb-0">
                <div className="text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold ">Restore changes</div>
                <img src='/icos/recycle-fill.png' 
                    className="w-6 h-6 cursor-pointer m-1 xs:m-3"
                    onClick={() => handleAdminSymbolsRecovery()}/>
            </div>
        </div>
        {!loading && availableSymbols[`${collection}`] && visibleSymbols[`${collection}`] &&
            <>
            <div className="text-center inline flex text-xxxs xxs:text-xxs xs:text-xs sm:text-sm ">
                <button className="relative border p-1 pl-4 pr-4 rounded-sm bg-sky-600 text-xxs xxs:text-xs xs:text-sm sm:text-base md:text-md text-white" 
                    disabled={saveBtnDisabled}
                    onClick={() => handleVisibleSymbolsUpdate()}>
                    Save modifications
                    {saveBtnDisabled && <div className="absolute inset-0 bg-gray-100 bg-opacity-60"></div>}
                </button>
            </div>
            <div className="flex font-mono flex-col xs:flex-row flex-grow w-full text-xxxs xxs:text-xxs xs:text-xs sm:text-sm">
                <div className="flex-col border p-1 sm:p-3 w-full xs:w-1/2 h-1/2 xs:h-full m-1 xs:m-3 bg-black overflow-auto">
                    <div className="text-center text-xxxs xxs:text-xxs xs:text-xs sm:text-sm  text-white">Available symbols</div>
                    {availableSymbols[collection].symbols.sort((x, y) => {
                        const xIsInB = visibleSymbols[collection].symbols.includes(x);
                        const yIsInB = visibleSymbols[collection].symbols.includes(y);

                        if (!xIsInB && yIsInB) {
                            return -1;
                        }
                        if (xIsInB && !yIsInB) {
                            return 1;
                        }
                        return 0;
                    }).map(el => 
                    <div key={el} className="relative flex m-1 justify-between border p-1 bg-white">
                        <div>{el}</div>
                        <img src='/icos/rightstraightarrow.png' className="symbol hidden xs:block cursor-pointer" onClick={() => handleAddSymbol(el)}/>
                        <img src='/icos/downstraightarrow.png' className="symbol block xs:hidden cursor-pointer" onClick={() => handleAddSymbol(el)}/>
                        {visibleSymbols[collection].symbols.includes(el) && <div className="absolute inset-0 bg-gray-100 bg-opacity-80"></div>}
                    </div>)}
                </div>
                <div className="flex-col border p-1 sm:p-3 w-full xs:w-1/2 h-1/2 xs:h-full m-1 xs:m-3 bg-black overflow-auto">
                    <div className="text-center text-xxxs xxs:text-xxs xs:text-xs sm:text-sm  text-white">Visible symbols</div>
                    {visibleSymbols[collection].symbols.map(el => <div key={el} className="flex m-1 justify-between border p-1 bg-white">
                            <div>{el}</div>
                            <img src='/icos/x.png' className="symbol cursor-pointer" onClick={() => handleRemoveSymbol(el)}/>
                    </div>)}
                </div>
            </div>
            </>
        }
        </>
    )
}

export default MarketSymbols