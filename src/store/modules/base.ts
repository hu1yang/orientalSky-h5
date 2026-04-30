import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BranchAgents, GroupBranch} from "@/types/identity.ts";
import type {IChannelSettings} from "@/types/group.ts";


const initialState:{
  branchAgents: BranchAgents[]
  channel: IChannelSettings[]
  branchMore:GroupBranch[]
} = {
  branchAgents:[],
  channel:[],
  branchMore:[]
}

const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers:{
    setBranchAgents(state, action: PayloadAction<BranchAgents[]>){
      state.branchAgents = action.payload
    },
    setChannel(state, action: PayloadAction<IChannelSettings[]>){
      state.channel = action.payload
    },
    setBranchMore(state, action: PayloadAction<GroupBranch[]>){
      state.branchMore = action.payload
    },
  }
})

export const {setBranchAgents,setChannel,setBranchMore} = baseSlice.actions
export default baseSlice.reducer
