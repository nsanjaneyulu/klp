export interface IAttachment {
    id: number;
    name: string;
    activity: string;
    data: any;
    fileType: string;
    uploadBy: string;
    localId: number;
    isUpdate?: boolean;
}
export interface IAttachmentLesson {
    name: string;
    data: any;
    fileType: string;
}