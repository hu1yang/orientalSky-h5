import {configureStore} from "@reduxjs/toolkit"

import baseSlice from './modules/base.ts'

export const store = configureStore({
  reducer: {
    baseInfo: baseSlice
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

