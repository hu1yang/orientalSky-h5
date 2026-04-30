export interface DocForm{
    agentIds:string[]
    isEnabled:boolean
    title:string
    content:string
    branchIds:string[]
    branchId?:string
    id?:string
}

export type Document = Pick<DocForm, 'id' | 'agentIds' | 'isEnabled' | 'title' | 'content' | 'branchIds' | 'branchId'> & {
    groupId:'',
    operator:string
    creator:string
    minTime:string
    maxTime:string
    updatedTime:string
    createdTime:string
}

export type DocSearch =
    Partial<Pick<Document, 'branchId'|'id' | 'operator' | 'creator'>> &
    Required<Pick<Document,'minTime'|'maxTime'>> & {
    isEnabled?:null|boolean
}

export interface DocListItem {
    count:number
    items:Document[]
}

export interface CommonResponseUpload {
    succeed: boolean;
    message: string;
    content: {
        id:string
        fileSize:number
        fileName:string
        fileType:string
        time:string
        userId:string
        remarks:string
        creator:string
    }
}
