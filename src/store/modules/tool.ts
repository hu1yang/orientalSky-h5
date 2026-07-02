import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import type {IIdentity, IPrincipal} from "@/types/identity.ts";


const token = Cookie.get('token')
const identity = localStorage.getItem('identity')

const initialState: {
  token: string
  identity: IIdentity|null
} = {
  token:token || '',
  identity:identity ? JSON.parse(identity) : null
}

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers:{
    setLogin(state, action: PayloadAction<IPrincipal>) {
      const token = action.payload.jwtToken.token
      state.token = action.payload.jwtToken.token
      state.identity = action.payload.identity
      Cookie.set('token', token)
    },
    setIdentity(state, action: PayloadAction<IIdentity>) {
      state.identity = action.payload
      localStorage.setItem('identity', JSON.stringify(state.identity))
    },
    removeLogin(state) {
      state.token = ''
      state.identity = null
    }
  }
})

export const {setLogin,setIdentity,removeLogin} = toolSlice.actions

export default toolSlice.reducer
