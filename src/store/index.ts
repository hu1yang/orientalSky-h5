import {configureStore} from "@reduxjs/toolkit"

import baseSlice from './modules/base.ts';
import toolSlice from './modules/tool.ts';

export const store = configureStore({
  reducer: {
    baseInfo: baseSlice,
    toolInfo: toolSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

