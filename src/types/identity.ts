
export type IScheme = 'group_scheme' | 'agent_scheme';

export type ILogin = {
    userName:string;
    password:string;
    multiple?:boolean;
    captchaId: string;
    captchaCode: string;
}

export type IIdentity = {
    userName: string;
    actualName: string;
    userId: string;
    roleNames: string[];
    properties: {
        type: string;
        value: string;
    }[];
    scheme: IScheme;
    groupId?: string;
    agentId?:string;
    branchIds: string[]|string;
}

export type IPrincipal = {
    identity: IIdentity;
    jwtToken: {
        scheme: IScheme;
        token: string;
        issued: string;  // 可以改为 Date 类型，如果后续有处理时间的需求
        expiry: string;  // 同上
    };
}

export type CommonResponse = {
    succeeded: boolean;
    errors: {
        code: string;
        description: string;
    }[];
}

export type UpdatePass = {
    oldPassword:string;
    newPassword:string;
    confirmPassword:string;
}

export interface ApiResponse extends CommonResponse {
    principal: IPrincipal|null;
}

export interface GroupBranch {
    groupId: string;
    id: string;
    code: string;
    name: string;
    country: string
    localAddress: string;
    otherName: string;
    description: string;
    time: string; // 如果需要，可以改为 Date 类型
}

export interface CommonDepartmentForm{
    name: string;
    code: string;
    otherName: string;
    description: string;
}

export interface UDepartmentForm extends CommonDepartmentForm {
    departmentId: string;
}

export interface IDepartmentForm extends CommonDepartmentForm {
    branchId: string;
}

export interface Department extends IDepartmentForm {
    id: string;
    creator: string;
    operator: string|null;
    updatedTime: string; // ISO 时间字符串
    createdTime: string; // ISO 时间字符串
}


export interface Role {
    id:string;
    name:string;
    description:string;
    roleLevel:number;
}

export type IUserForm =  {
    actualName:string;
    emailAddress:string;
    phoneNumber:string;
    userName:string;
    password:string;
    branchIds:string[]|string;
    roleIds:string[];
    departmentIds:string[]
}

export type IUserFormAgent = IUserForm & {
    agentId:string;
}


export interface User {
    id: string;
    userName: string;
    actualName: string;
    creator: string;
    phoneNumber: string;
    emailAddress: string;
    isLocked: boolean;
    lockoutEnd: string|null; // ISO 格式时间字符串
    operator: string|null;
    updatedTime: string; // ISO 格式时间字符串
    createdTime: string; // ISO 格式时间字符串
}

export interface UserResponse {
    branchs?:GroupBranch[];
    roles:Role[];
    departments?:Department[];
    user:User;
}


export type UserAgentResponse = Omit<UserResponse, 'branchs'|'departments'>;

export interface UserLogInfo {
    id: string;
    userId: string;
    userName: string;
    isLoggedin: boolean;
    remoteIpAddress: string;
    time: string;
}


export type RouteValidateKey = {
    routeKey: string;
    headerTitle: string;
    description: string;
    className: string;
    methodName: string;
}

export interface AssemblyData {
    assemblyName: string;
    groupKey: string;
    routeValidateKeys: RouteValidateKey[];
}

type RouteValidateKeyWithSelected = RouteValidateKey & {
    selected: boolean;
};

export type AssemblyDataForm = Omit<AssemblyData, 'routeValidateKeys'> & {
    routeValidateKeys: RouteValidateKeyWithSelected[]
}

export type AssemblyDataSubmitForm = Omit<AssemblyData, 'routeValidateKeys'> & {
    userRouteKeyInfos: RouteValidateKeyWithSelected[]
}

export interface AuthorizationRoute extends RouteValidateKey{
    id: string;
    userId: string;
    groupKey: string;
    assemblyName:string;
    creator:string;
    time:string;
}

export interface Agents {
    balance?: string
    currency?: string
    branchId: string;
    channelCodes:string[]
    id: string;
    name: string;
    code: string;
    contractor: string;
    otherName: string;
    isLocked: boolean;
    localAddress: string;
    description: string;
    operator: string|null;
    creator: string;
    updatedTime: string; // ISO 格式时间字符串
    createdTime: string; // ISO 格式时间字符串
    country:string
    groupCode:string
    emailAddress:string
    contactName:string
    phoneNumber:string
    scale:{
        scaleLimited:string|number
        queryLimited:string|number
        totalQueryTimes:string|number
        totalAddtoTimes:string|number
        availableCounts:string|number
        limitedDayLength:string|number
    }
}

export interface AgentsCount {
    count:number
    items:Agents[]
}
export type AgentsSearchForm = Pick<Agents, 'branchId'|'code'|'country'|'groupCode'|'name'> & {
    agentId:string
}


export type AgentForm = Omit<Agents, 'id' | 'operator' | 'creator' | 'updatedTime' | 'createdTime' | 'branchId' | 'isLocked'> & {
    branchId?:string;
    isLocked?:boolean;
    agentId?:string;
}

export interface AgentUser extends User{
    agentId:string;
}


export interface UserWithRoles {
    user: AgentUser;
    roles: Role[];
}

export type AgentUserForm = Omit<IUserForm, 'branchIds' | 'departmentIds'> & {
    agentId:string;
}

export type updateAgentRouteForm = {
    userId: string;
    newPassword?: string;
} & Omit<Partial<AssemblyData>, 'routeValidateKeys'> & {
    userRouteKeyInfos?: AssemblyData['routeValidateKeys'];
}

export type BranchAgents = {
    branch:GroupBranch
    agents:Agents[]
}

export interface BankAgents {
    branchId: string,
    bankSwiftOrName: string,
    bankAccountName: string,
    bankAccountCode: string,
    id: string,
    creator: string,
    operator: string,
    updatedTime: string,
    createdTime: string
}

export type BankAgentForm = Pick<BankAgents, 'branchId'|'bankSwiftOrName'|'bankAccountName'|'bankAccountCode'> & {
    branchBankId:string
}

export interface UploadAgentForm{
    AgentId: string;
    Remarks: string;
    FormFiles: any[];
}

export interface UpdateName {
    userId: string
    actualName: string
}

export interface UpdateUserInfo{
    emailAddress: string
    phoneNumber: string
}


export type DepartmentsData = {
    branchId:string
    id:string
    name:string
    code:string
    creator:string
    otherName:string
    description:string
    operator:string
    updatedTime:string
    createdTime:string
}

export type UserEntities = {
    count:number,
    items:UserResponse[]
}
export type UserEntitiesForm = {
    branchId?:string
    phoneNumber?:string
    userName:string
    emailAddress:string
    roleId:string
    departmentId:string
}
