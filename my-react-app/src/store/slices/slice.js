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
    asset : null,
    portfolioCreationWindow : false,
    portfolios : [],
    assetToPortfolioWindow : false,
    selectedPortfolio : null,
    portfolioDeletionDialogWindow : false,
    fullPortfolioAssetDetailsWindows : false,
    portfolioAssets : [],
    portfolioAssetsFullDetails : [],
    portfolioAssetDeletionDialogWindow : false,
    accountDeletionDialogWindow : false,
    adminAuthentificationDialogWindow : false,
    adminToken : null,
    analysesDialogWindow : false
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
        },
        setPortfolioCreationWindow : (state , action)=>{
            state.portfolioCreationWindow = action.payload
        },
        setPortfolios : (state , action)=>{
            state.portfolios = action.payload
        },
        setAssetToPortfolioWindow : (state , action)=>{
            state.assetToPortfolioWindow = action.payload
        },
        setSelectedPortfolio : (state , action)=>{
            state.selectedPortfolio = action.payload
        },
        setPortfolioDeletionDialogWindow : (state , action)=>{
            state.portfolioDeletionDialogWindow = action.payload
        },
        setFullPortfolioAssetDetailsWindows : (state , action)=>{
            state.fullPortfolioAssetDetailsWindows = action.payload
        },
        setPortfolioAssets : (state , action)=>{
            state.portfolioAssets = action.payload
        },
        setPortfolioAssetsFullDetails : (state , action)=>{
            state.portfolioAssetsFullDetails = action.payload
        },
        setPortfolioAssetDeletionDialogWindow : (state , action)=>{
            state.portfolioAssetDeletionDialogWindow = action.payload
        },
        setAccountDeletionDialogWindow : (state , action)=>{
            state.accountDeletionDialogWindow = action.payload
        },
        setAdminAuthentificationDialogWindow : (state , action)=>{
            state.adminAuthentificationDialogWindow = action.payload
        },
        setAdminToken : (state , action)=>{
            state.adminToken = action.payload
        },
        setAnalysesDialogWindow : (state , action)=>{
            state.analysesDialogWindow = action.payload
        }
        
        
    }
})

export const {setAssets,setLastUpdate,setCollection
    ,setError,setToken,setMenu,setLoading,setNotificationCenter
    ,setOnNotify,setWatchlistSymbols,setPushUpMessage,setAlertHistoryUpdate,
    setAssetDetails ,setAsset,setPortfolioCreationWindow ,setPortfolios,
    setAssetToPortfolioWindow,setSelectedPortfolio ,setPortfolioDeletionDialogWindow,
    setFullPortfolioAssetDetailsWindows, setPortfolioAssets,setPortfolioAssetsFullDetails,
    setPortfolioAssetDeletionDialogWindow, setAccountDeletionDialogWindow,
    setAdminAuthentificationDialogWindow, setAdminToken, setAnalysesDialogWindow
}=globalSlice.actions