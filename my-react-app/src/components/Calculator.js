import { useEffect, useState , useRef } from "react"
import { fetchServer } from "../api_s/fetchServer"
import Spinner from "./layout/Spinner"

function Calculator() {
    const [collectionfrom , setCollectionFrom] = useState('stocks')
    const [collectionto , setCollectionTo] = useState('stocks')
    const [currentCollectionFrom , setCurrentCollectionFrom] = useState('Stocks')
    const [currentCollectionTo , setCurrentCollectionTo] = useState('Stocks')

    const [assetsfrom , setAssetsFrom] = useState([])
    const [assetsto , setAssetsTo] = useState([])

    const [filteredAssetsFrom , setFileteredAssetsFrom] = useState([])
    const [filteredAssetsTo , setFileteredAssetsTo] = useState([])

    const [searchFlagTo , setSearchFlagTo] = useState(false)
    const [searchFlagFrom , setSearchFlagFrom] = useState(false)

    const [loadingFrom , setLoadingFrom] = useState(false)
    const [loadingTo , setLoadingTo] = useState(false)

    const [baseSymbol , setBaseSymbol] = useState('')
    const [targetSymbol , setTargetSymbol] = useState('')
    const [output , setOutput] = useState('')
    const inputRef = useRef()

    function searchMechanism(value , col) {
        const searchTxt = value.replace(/\s/g, '')
        const matchedAssets = (col=='to'?assetsto:assetsfrom).filter(el => (
            el.name.toLowerCase().replace(/\s/g, '').includes(searchTxt) 
            || 
            el.symbol.toLowerCase().replace(/\s/g, '').includes(searchTxt)
            )
        )

        if (value == '' && col == 'to') {
            setSearchFlagTo(false)
        } else if (value == '' && col == 'from'){
            setSearchFlagFrom(false)
        } else if(col == 'to') {
            setSearchFlagTo(true)
        } else {
            setSearchFlagFrom(true)
        }

        if(col == 'to') {
            if(matchedAssets.length != 0 && value !='') {
                setTargetSymbol(matchedAssets[0].symbol)
                calculateValue(inputRef.current.value , baseSymbol , targetSymbol)
            } else if(matchedAssets.length == 0 && searchFlagTo) {
                setTargetSymbol('')
                calculateValue(inputRef.current.value , baseSymbol , targetSymbol)
            }
            setFileteredAssetsTo(matchedAssets)
        } else {
            if(matchedAssets.length != 0 && value != '') {
                setBaseSymbol(matchedAssets[0].symbol)
                calculateValue(inputRef.current.value , baseSymbol , targetSymbol)
            } else if(matchedAssets.length == 0 && searchFlagFrom) {
                setBaseSymbol('')
                calculateValue(inputRef.current.value , baseSymbol , targetSymbol)
            }
            setFileteredAssetsFrom(matchedAssets)
        }
        
    }

    function calculateValue(qt , bS , tS) {
        if(Number(qt) == 0) {
            setOutput('')
            return
        }
        if(bS == '' || tS=='') {
            setOutput('')
            return
        }
        const value = (assetsfrom.find(el => el.symbol == bS)?.current_price * qt) / assetsto.find(el => el.symbol == tS)?.current_price
        setOutput(`${qt} ${bS} = ${value.toFixed(2)} ${tS}`)
    }

    useEffect(()=>{
        setSearchFlagFrom(false)
        setFileteredAssetsFrom([])

        setLoadingFrom(true)
        fetchServer(collectionfrom)
        .then(data => data.data.map(el => ({
            name:el.name,
            symbol:el.symbol,
            current_price:el.current_price
        })))
        .then(data =>{
            setAssetsFrom(data)
            setBaseSymbol(data[0].symbol)
            setLoadingFrom(false)
            setOutput('')
        })
        .catch(err => console.error(err))

    },[collectionfrom])

    useEffect(()=>{
        setSearchFlagTo(false)
        setFileteredAssetsTo([])

        setLoadingTo(true)
        fetchServer(collectionto)
        .then(data => data.data.map(el => ({
            name:el.name,
            symbol:el.symbol,
            current_price:el.current_price
        })))
        .then(data =>{
            setAssetsTo(data)
            setTargetSymbol(data[0].symbol)
            setLoadingTo(false)
            calculateValue('')
        })
        .catch(err => console.error(err))
    },[collectionto])

    return(
        <>
            {!loadingFrom || !loadingTo ?
            <>
            <div className="absolute inset-0 w-full h-full bg-gray-100"></div>
            <div className="absolute bg-gray-100 top-1/3 transform -translate-y-1/2 flex flex-col xs:flex-row">
                {!loadingFrom ? 
                <div className="w-1/2 grid grid-cols-1 gap-4 text-xxs sm:text-base w-full xs:w-auto p-4">
                    <div className="text-center text-lg font-bold">from</div>
                    <div className="flex items-center ml-1 mr-1 border-b-1 border-t-1 border-gray-400">
                        <p className="flex-grow">market:</p>
                        <select className="focus:outline-none bg-transparent text-end " onChange={e=> {setCollectionFrom(e.target.value.toLowerCase());setCurrentCollectionFrom(e.target.value)}} value={currentCollectionFrom}>
                            <option >Stocks</option>
                            <option >Cryptocurrencies</option>
                            <option >Commodities</option>
                        </select>                    
                    </div>
                    <div className="flex items-center  bg-transparent border-b-1 border-t-1 border-gray-400  ml-1 mr-1 max-w-full">
                        <input type="text" className="focus:outline-none bg-transparent pl-1 text-red flex-grow" placeholder="search" onChange={e => searchMechanism(e.target.value.toLowerCase(),'from')}/>
                        <select className="focus:outline-none text-end bg-transparent" onChange={(e) => {setBaseSymbol(e.target.value) ; calculateValue(inputRef.current.value , e.target.value , targetSymbol)}}>
                            {
                                filteredAssetsFrom.length != 0 ?
                                filteredAssetsFrom.map(el => <option key={el.symbol}>{el.symbol}</option>)
                            :
                                <>
                                    {filteredAssetsFrom.length == 0 && searchFlagFrom ?
                                        filteredAssetsFrom.map(el => <option key={el.symbol}>{el.symbol}</option>)
                                    :
                                        assetsfrom.map(el => <option key={el.symbol}>{el.symbol}</option>)
                                    }
                                </>
                            }
                        </select>
                    </div>
                    <input type="number" ref={inputRef} min='0' className="focus:outline-none pl-1 bg-transparent border-b-1 border-t-1 border-gray-400 ml-1 mr-1" placeholder="type..." onChange={(e)=>{if(e.target.value != 0) calculateValue(Number(e.target.value) , baseSymbol , targetSymbol)}}/>
                </div> :
                <Spinner loading={loadingFrom}/>
                }
                {
                !loadingTo ? 
                <div className="w-1/2  grid grid-cols-1 gap-4 text-xxs sm:text-base w-full xs:w-auto p-4">
                    <div className="text-center text-lg font-bold">to</div>
                    <div className="flex items-center ml-1 mr-1 border-b-1 border-t-1 border-gray-400">
                        <p className="flex-grow">market:</p>
                        <select className="focus:outline-none bg-transparent text-end " onChange={e=> {setCollectionTo(e.target.value.toLowerCase());setCurrentCollectionTo(e.target.value)}} value={currentCollectionTo}>
                            <option >Stocks</option>
                            <option >Cryptocurrencies</option>
                            <option >Commodities</option>
                        </select>                    
                    </div>
                    <div className="flex items-center  bg-transparent border-b-1 border-t-1 border-gray-400  ml-1 mr-1 max-w-full">
                        <input type="text" className="focus:outline-none bg-transparent pl-1 text-red flex-grow" placeholder="search" onChange={e => searchMechanism(e.target.value.toLowerCase(),'to')}/>
                        <select className="focus:outline-none text-end bg-transparent"  onChange={(e) => {setTargetSymbol(e.target.value) ; calculateValue(inputRef.current.value , baseSymbol , e.target.value)}}>
                        {
                            filteredAssetsTo.length != 0 ?
                            filteredAssetsTo.map(el => <option key={el.symbol}>{el.symbol}</option>)
                        :
                            <>
                                {filteredAssetsTo.length == 0 && searchFlagTo ?
                                    filteredAssetsTo.map(el => <option key={el.symbol}>{el.symbol}</option>)
                                :
                                    assetsto.map(el => <option key={el.symbol}>{el.symbol}</option>)
                                }
                            </>
                        }
                        </select>
                    </div>
                    <input type="text" readOnly className={`focus:outline-none pl-1 bg-transparent border-b-1 border-t-1 border-gray-400 ml-1 mr-1 text-center font-mono `} value={output}/>
                </div> :
                <Spinner loading={loadingTo}/>
                }
            </div>
            </>
            :
            <Spinner loading={loadingFrom && loadingTo}/>
            }
        </>
    )
}

export default Calculator
