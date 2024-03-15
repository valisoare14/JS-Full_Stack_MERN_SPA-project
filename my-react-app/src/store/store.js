import {configureStore} from '@reduxjs/toolkit'
import { globalSlice } from './slices/slice'

export default configureStore({
    reducer:{
        global:globalSlice.reducer
    }
})









//npm install @reduxjs/toolkit  react-redux // 2 librarii '@reduxjs/toolkit' si 'react-redux'