

export class RequestModel {
    id: number = 0;
    wfVersion: number = 0
    wfLevel: number = 0
    requesterID: string = "";
    requester: string = "";
    requesterEmail: string = "";
    requesterJobTitle: string = "";
    requesterDept: string = "";
    title: string = "";
    description: string = "";
    recommendation: string = "";
    comments: string = "";
    identifiedBy: string = "";
    identifiedByEmail: string = "";
    identifiedOn: string = ";"
    securityClassification: string = "";
    keywords: string = "";
    source: string = "";
    sourceDepartment: string = "";
    coordinator: string = "";
    expertiseArea: string = "";
    expert: string = "";
    action: string = "";
    categoryExpertsEmails: string = "";
    actionCode: string = "";
    actionComments: string = "";
    thumbnail: any;
    attachments: any [] = [];
    ExpertRequired?: boolean;
    IsBestPractice?: boolean;
  }
