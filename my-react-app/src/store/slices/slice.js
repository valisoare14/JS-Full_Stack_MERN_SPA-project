import { createSlice } from "@reduxjs/toolkit";

const initialState={
    assets:[],
    lastUpdate:null,
    collection:'stocks',
    error:null,
    token:null,
    menu:false,
    loading:true,
    notificationCenter:false,
    onNotify:false,
    watchlistSymbols:[],
    pushUpMessage:'',
    alertHistoryUpdate : false,
    assetDetails:false,
    asset : null
}

export const globalSlice=createSlice({
    name:'global',
    initialState,
    reducers:{
        setAssets:(state,action)=>{
            state.assets=action.payload
        },
        setLastUpdate:(state,action)=>{
            state.lastUpdate=action.payload
        },
        setCollection:(state,action)=>{
            state.collection=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        setToken:(state,action)=>{
            state.token=action.payload
        },
        setMenu:(state,action)=>{
            state.menu=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setNotificationCenter:(state,action)=>{
            state.notificationCenter=action.payload
        },
        setOnNotify:(state,action)=>{
            state.onNotify=action.payload
        },
        setWatchlistSymbols:(state,action)=>{
            state.watchlistSymbols=action.payload
        },
        setPushUpMessage:(state,action)=>{
            state.pushUpMessage=action.payload
        },
        setAlertHistoryUpdate:(state,action)=>{
            state.alertHistoryUpdate=action.payload
        },
        setAssetDetails : (state , action) =>{
            state.assetDetails = action.payload
        },
        setAsset : (state , action)=>{
            state.asset = action.payload
        }
    }
})

export const {setAssets,setLastUpdate,setCollection
    ,setError,setToken,setMenu,setLoading,setNotificationCenter
    ,setOnNotify,setWatchlistSymbols,setPushUpMessage,setAlertHistoryUpdate,
    setAssetDetails ,setAsset
}=globalSlice.actions