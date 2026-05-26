import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BranchAgents, GroupBranch} from "@/types/identity.ts";
import type {IChannelSettings} from "@/types/group.ts";
import type {RootState} from "@/store";


const initialState: {
  branchAgents: BranchAgents[]
  channel: IChannelSettings[]
  branchMore: GroupBranch[]
} = {
  branchAgents: [],
  channel: [],
  branchMore: []
}

const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setBranchAgents(state, action: PayloadAction<BranchAgents[]>) {
      state.branchAgents = action.payload
    },
    setChannel(state, action: PayloadAction<IChannelSettings[]>) {
      state.channel = action.payload
    },
    setBranchMore(state, action: PayloadAction<GroupBranch[]>) {
      state.branchMore = action.payload
    },
  }
})

export const {setBranchAgents, setChannel, setBranchMore} = baseSlice.actions
export const selectBranchAgents = (state: RootState) => state.baseInfo.branchAgents
export const selectAgentMap = createSelector(
  [selectBranchAgents],
  (branchAgents) => {
    const map = new Map()
    branchAgents.forEach(branch => {
      branch.agents.forEach(agent => {
        map.set(agent.id, {
          agentCode: agent.code,
          branchCode: branch.branch.code
        })
      })
    })
    return map
  }
)

export const selectGroupMap = createSelector(
  [selectBranchAgents],
  (branchAgents) => {
    const map = new Map()
    branchAgents.forEach(branch => {
      map.set(branch.branch.id, {
        branchCode: branch.branch.code
      })
    })
    return map
  }
)

export default baseSlice.reducer
