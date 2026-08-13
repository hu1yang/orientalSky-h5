import axios from "../createRequest.ts";
import type {
    AgentForm, Agents,
    AgentsCount, AgentsSearchForm,
    AgentUserForm,
    ApiResponse,
    AssemblyData,
    AssemblyDataSubmitForm,
    AuthorizationRoute,
    BankAgentForm,
    BankAgents,
    BranchAgents,
    CommonResponse,
    Department,
    GroupBranch,
    IDepartmentForm,
    IIdentity,
    ILogin,
    IUserForm,
    IUserFormAgent,
    Role,
    UDepartmentForm, UpdateName,
    UpdatePass, UpdateUserInfo,
    UploadAgentForm,
    User,
    UserAgentResponse, UserEntities, UserEntitiesForm,
    UserLogInfo,
    UserResponse,
    UserWithRoles
} from "@/types/identity.ts";
import type {AgentUploadList, CommonResponseGroup, IBranch} from "@/types/group.ts";

// group用户登录
export const userSignin = (form:ILogin) => axios.post<ApiResponse,ILogin>('/identityApi/GroupAccount/UserSignin',form)

export const createBranchGroup = (form:IBranch) => axios.post<CommonResponse,IBranch>('/identityApi/GroupManager/CreateBranch',form)
export const updateBranchGroup = (form:IBranch) => axios.patch<CommonResponse,IBranch>('/identityApi/GroupManager/UpdateBranch',form)
export const getUserBaseInfosGroup = (id:string) => axios.get<User[]>(`/identityApi/GroupAccount/GetUserBaseInfos/${id}`)
export const exportAgentListsGroup = () => axios.post<Blob>(`/identityApi/GroupAgent/ExportAgentLists`,{},{responseType: 'blob'})
// 获取已授权代理列表
export const getBranchAgents = () => axios.get<BranchAgents[]>('/identityApi/GroupAccount/GetBranchAgents')

// group用户退出
export const userSignOut = () => axios.post<CommonResponse,null>('/identityApi/GroupAccount/UserSignOut')

// 获取用户信息
export const getIdentity = () => axios.get<IIdentity>('/identityApi/GroupAccount/GetIdentity')

// 更新用户密码
export const personalUpdatePassword = (form:UpdatePass) => axios.patch<CommonResponse,UpdatePass>('/identityApi/GroupAccount/UpdatePassword',form)

// 获取集团公司列表
export const getGroupBranchs = () => axios.get<GroupBranch[]>('/identityApi/GroupAccount/GetGroupBranchs')

// 获取授权公司列表
export const getUserBranchs = () => axios.get<GroupBranch[]>('/identityApi/GroupAccount/GetUserBranchs')

// branchId 获取公司部门列表
export const getDepartments = (id:string) => axios.get<Department[]>(`/identityApi/GroupAccount/GetDepartments/${id}`)

// branchId 获取公司用户列表
export const getUserEntities = (id?: string) => {
    const url = id
        ? `/identityApi/GroupAccount/GetUserEntities/${id}`
        : `/identityApi/GroupAccount/GetUserEntities`;
    return axios.get<UserResponse[]>(url);
};
// 创建公司部门
export const createDepartment = (form:IDepartmentForm) => axios.post<CommonResponse,IDepartmentForm>('/identityApi/GroupManager/CreateDepartment',{
    ...form
})

// 更新公司部门
export const updateDepartment = (form:UDepartmentForm) => axios.patch<CommonResponse,UDepartmentForm>('/identityApi/GroupManager/UpdateDepartment',form)

// 删除公司部门
export const deleteDepartment = (departmentId:string) => axios.del<CommonResponse,{departmentId:string}>('/identityApi/GroupManager/DeleteDepartment',{departmentId})

// 获取角色列表
export const getPermissionRoles = () => axios.get<Role[]>('/identityApi/GroupAccount/GetPermissionRoles')



// 创建用户
export const createUser = (form:IUserForm) => axios.post<CommonResponse,IUserForm>('/identityApi/GroupManager/CreateUser',form)

// 用户锁定设置
export const updateLockout = (userId:string) => axios.patch<CommonResponse,{userId:string}>('/identityApi/GroupManager/UpdateLockout',{userId})

// 用户删除
export const deleteUser = (userId:string) => axios.del<CommonResponse,{userId:string}>('/identityApi/GroupManager/DeleteUser',{userId})

// 用户更新密码
export const updatePassword = ({userId,newPassword}:{userId:string;newPassword:string;}) => axios.patch<CommonResponse,{userId:string;newPassword:string;}>('/identityApi/GroupManager/ChangePassword',{userId,newPassword})

// 用户更新角色
export const updateUserRoles = ({userId,newRoleIds}:{userId:string,newRoleIds:string[]}) => axios.patch<CommonResponse,{userId:string;newRoleIds:string[];}>('/identityApi/GroupManager/UpdateUserRoles',{userId,newRoleIds})

// 追加公司
export const appendUserBranch = ({userId,newBranchId,newDepartmentIds}:{userId:string,newBranchId:string,newDepartmentIds:string[]}) => axios.patch<CommonResponse,{userId:string,newBranchId:string,newDepartmentIds:string[]}>(`/identityApi/GroupManager/AppendUserBranch`,{userId,newBranchId,newDepartmentIds})

// 删除公司
export const deleteUserBranch = ({userId,oldBranchId}:{userId:string,oldBranchId:string}) => axios.patch<CommonResponse,{userId:string,oldBranchId:string}>(`/identityApi/GroupManager/DeleteUserBranch`,{userId,oldBranchId})

// 用户更新部门
export const updateUserDepartments = ({userId,branchId,departmentIds}:{userId:string,branchId:string,departmentIds:string[]}) => axios.patch<CommonResponse,{userId:string,branchId:string,departmentIds:string[]}>('/identityApi/GroupManager/UpdateUserDepartments',{userId,branchId,departmentIds})

// 用户登录信息
export const getLoginInfos = (userId:string,pageNumber:number,pageSize:number) => axios.get<UserLogInfo[]>(`/identityApi/GroupAccount/GetLoginInfos/${userId}/${pageNumber}/${pageSize}`)



// 获取路由
export const getAuthorizableRouting = () => axios.get<AssemblyData>('/identityApi/GroupAccount/GetAuthorizableRouting')

// 获取已授权的路由
export const getAuthorizedRouting = (userId:string) => axios.get<AuthorizationRoute[]>(`/identityApi/GroupAccount/GetAuthorizedRouting/${userId}`)

// 更新路由授权
export const updateUserRoutings = (userId:string,form:AssemblyDataSubmitForm[]) => axios.patch<CommonResponse,AssemblyDataSubmitForm[]>(`/identityApi/GroupManager/UpdateUserRoutings/${userId}`,form)


export const getAgentsCount = (form:AgentsSearchForm) => axios.post<AgentsCount,AgentsSearchForm>('/identityApi/GroupAgent/GetAgents',form)


// 新增代理公司
export const createAgent = (form:AgentForm) => axios.post<CommonResponse,AgentForm>('/identityApi/GroupAgent/CreateAgent',form)

// 更新代理公司
export const updateAgent = (form:AgentForm) => axios.patch<CommonResponse,AgentForm>('/identityApi/GroupAgent/UpdateAgent',form)

// 删除代理公司
export const deleteAgent = (id:string) => axios.del<CommonResponse,{agentId:string}>('/identityApi/GroupAgent/DeleteAgent', {agentId:id})
export const uploadAgentAgreementsGroup = (form:UploadAgentForm) => {
    const formData = new FormData()
    formData.append('AgentId', form.AgentId)
    formData.append('Remarks', form.Remarks)
    form.FormFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseGroup>(`/identityApi/GroupAgent/UploadAgentAgreements`,formData,'post')
}
export const getAgentAgreementsGroup = (id:string) => axios.get<AgentUploadList[]>(`/identityApi/GroupAgent/GetAgentAgreements/${id}`)
export const downloadAgentAgreementGroup = (id:string) => axios.get<Blob>(`/identityApi/GroupAgent/DownloadAgentAgreement/${id}`,{},{responseType: 'blob'})
export const deleteAgentAgreementGroup = (id:string) => axios.del<CommonResponseGroup>(`/identityApi/GroupAgent/DeleteAgentAgreement/${id}`)



// 代理用户列表
export const getAgentUserEntities = (agentId:string) => axios.get<UserWithRoles[]>(`/identityApi/GroupAgent/GetAgentUserEntities/${agentId}`)

// 代理公司用户创建
export const createAgentUser = (form:AgentUserForm) => axios.post<CommonResponse,AgentUserForm>('/identityApi/GroupAgent/CreateAgentUser',form)

// 代理角色列表
export const getAgentRoles = () => axios.get<Role[]>('/identityApi/GroupAgent/GetAgentRoles')

// 删除代理用户
export const deleteAgentUser = (id:string) => axios.del<CommonResponse, { userId:string }>('/identityApi/GroupAgent/DeleteAgentUser', {userId:id})

// 更新密码
export const updateAgentUserPassword = ({userId,newPassword}:{userId:string;newPassword:string;}) => axios.patch<CommonResponse,{userId:string;newPassword:string;}>('/identityApi/GroupAgent/ChangeAgentUserPassword',{userId,newPassword})

// 用户锁定
export const updateAgentUserLockout = (userId:string) => axios.patch<CommonResponse,{userId:string}>('/identityApi/GroupAgent/UpdateAgentUserLockout',{userId})

// 授权路由列表
export const getAgentAuthorizableRouting = () => axios.get<AssemblyData>('/identityApi/GroupAgent/GetAuthorizableRouting')

// 已授权路由列表
export const getGroupAgentAuthorizedRouting = (userId:string) => axios.get<AuthorizationRoute[]>(`/identityApi/GroupAgent/GetAuthorizedRouting/${userId}`)



// 更新路由授权
export const updateAgentUserRoutings = (userId:string,form:AssemblyDataSubmitForm[]) => axios.patch<CommonResponse,AssemblyDataSubmitForm[]>(`/identityApi/GroupAgent/UpdateAgentUserRoutings/${userId}`,form)

// 获取公司银行列表
export const getBranchBanksAllGroup = () => axios.get<BankAgents[]>(`/identityApi/GroupAccount/GetBranchBanks`)
export const getBranchBanksGroup = (id:string) => axios.get<BankAgents[]>(`/identityApi/GroupAccount/GetBranchBanks/${id}`)
export const createBranchBankGroup = (form:BankAgentForm) => axios.post<CommonResponse,BankAgentForm>(`/identityApi/GroupManager/CreateBranchBank`,form)
export const updateBranchBankGroup = (form:BankAgentForm) => axios.patch<CommonResponse,BankAgentForm>(`/identityApi/GroupManager/UpdateBranchBank`,form)
export const deleteBranchBankGroup = (branchBankId:string) => axios.del<CommonResponse,{branchBankId:string}>(`/identityApi/GroupManager/DeleteBranchBank`, {branchBankId})


export const getUserEntityGroup = () => axios.get<UserResponse>(`/identityApi/GroupAccount/GetUserEntity`)
export const updateActualNameGroup = (form:UpdateName) => axios.patch<CommonResponse,UpdateName>(`/identityApi/GroupManager/UpdateActualName`,form)
export const UpdateUserInfoGroup = (form:UpdateUserInfo) => axios.patch<CommonResponse,UpdateUserInfo>(`/identityApi/GroupAccount/UpdateUserInfo`,form)

export const getAllRoleEntitiesGroup = () => axios.get<Role[]>(`/identityApi/GroupAccount/GetAllRoleEntities`)
export const getUserEntitiesGroup = (form:UserEntitiesForm) => axios.post<UserEntities,UserEntitiesForm>('/identityApi/GroupAccount/GetUserEntities',form)

// Agent

// 登录
export const UserSigninAgent = (form:ILogin) => axios.post<ApiResponse , ILogin>('/identityApi/AgentAccount/UserSignin',form)

// 验证码
export const getCaptcha = (id:string) => axios.get<Blob>(`/identityApi/AgentAccount/GetCaptcha/${id}`,{},{responseType: 'blob'})

// 获取用户信息
export const getIdentityAgent = () => axios.get<IIdentity>('/identityApi/AgentAccount/GetIdentity')

// 更新用户密码
export const personalUpdatePasswordAgent = (form:UpdatePass) => axios.patch<CommonResponse,UpdatePass>('/identityApi/AgentAccount/UpdatePassword',form)

// agent用户退出
export const userSignOutAgent = () => axios.post<CommonResponse,null>('/identityApi/AgentAccount/UserSignOut')

// 代理用户列表
// export const getUserEntitiesAgent = () => axios.get<UserAgentResponse[]>('/identityApi/AgentAccount/GetUserEntities')
export const getUserEntitiesAgent = (form:UserEntitiesForm) => axios.post<UserEntities,UserEntitiesForm>('/identityApi/AgentAccount/GetUserEntities',form)

// 代理用户创建
export const createUserAgent = (form:IUserFormAgent) => axios.post<CommonResponse,IUserFormAgent>('/identityApi/AgentManager/CreateUser',form)

// 代理获取角色列表
export const getPermissionRolesAgent = () => axios.get<Role[]>('/identityApi/AgentAccount/GetPermissionRoles')

// 代理用户锁定设置
export const updateLockoutAgent = (userId:string) => axios.patch<CommonResponse,{userId:string}>('/identityApi/AgentManager/UpdateUserLocked',{userId})

// 代理用户更新密码
export const updatePasswordAgent = ({userId,newPassword}:{userId:string;newPassword:string;}) => axios.patch<CommonResponse,{userId:string;newPassword:string;}>('/identityApi/AgentManager/ChangeUserPassword',{userId,newPassword})

// 代理用户更新角色
export const updateUserRolesAgent = ({userId,newRoleIds}:{userId:string,newRoleIds:string[]}) => axios.patch<CommonResponse,{userId:string;newRoleIds:string[];}>('/identityApi/AgentManager/UpdateUserRoles',{userId,newRoleIds})

// 代理用户删除
export const deleteUserAgent = (userId:string) => axios.del<CommonResponse,{userId:string}>('/identityApi/AgentManager/DeleteUser',{userId})

// 代理用户登录信息
export const getLoginInfosAgent = (userId:string,pageNumber:number,pageSize:number) => axios.get<UserLogInfo[]>(`/identityApi/AgentAccount/GetLoginInfos/${userId}/${pageNumber}/${pageSize}`)

// 代理获取路由
export const getAuthorizableRoutingAgent = () => axios.get<AssemblyData>('/identityApi/AgentAccount/GetAuthorizableRouting')

// 代理获取已授权的路由
export const getAuthorizedRoutingAgent = (userId:string) => axios.get<AuthorizationRoute[]>(`/identityApi/AgentAccount/GetAuthorizedRouting/${userId}`)

// 更新路由授权
export const updateUserRoutingsAgent = (userId:string,form:AssemblyDataSubmitForm[]) => axios.patch<CommonResponse,AssemblyDataSubmitForm[]>(`/identityApi/AgentManager/UpdateUserRoutings/${userId}`,form)
export const getBranchBanksAgent = () => axios.get<BankAgents[]>(`/identityApi/AgentAccount/GetBranchBanks`)

export const getUserEntityAgent = () => axios.get<UserAgentResponse>(`/identityApi/AgentAccount/GetUserEntity`)
export const updateActualNameAgent = (form:UpdateName) => axios.patch<CommonResponse,UpdateName>(`/identityApi/AgentManager/UpdateActualName`,form)
export const UpdateUserInfoAgent = (form:UpdateUserInfo) => axios.patch<CommonResponse,UpdateUserInfo>(`/identityApi/AgentAccount/UpdateUserInfo`,form)


export const getAgentAgent = () => axios.get<Agents>(`/identityApi/AgentAccount/GetAgent`)


export const getAllRoleEntitiesAgent = () => axios.get<Role[]>(`/identityApi/AgentAccount/GetAllRoleEntities`)
