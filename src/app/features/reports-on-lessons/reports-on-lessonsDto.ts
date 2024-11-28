export const reportListColumnConfig = [
  { field: 'referenceNo', header: 'Reference Number' },
  { field: 'requester', header: 'Requester Name' },
  { field: 'createdOn', header: 'Created On' },
  { field: 'modifiedOn', header: 'Last Action On' },
  { field: 'status', header: 'Status' },
  { field: 'actionUser', header: 'Assign To' },
  { field: 'reused', header: 'Reused' },
  { field: 'timeSaved', header: 'Time Saved' },
  { field: 'costSaved', header: 'Cost Saved' },
  { field: 'lessonType', header: 'Lesson Type' },
  { field: 'rateEtr', header: 'Easy to Replicate' },
  { field: 'rateSdp', header: 'Sufficient Details Provided' },
  { field: 'rateIai', header: 'Impact on asset integrity ' },
];
export const bypassListDataConfig = [
  {
    referenceNumber: 'BP-0000337',
    requesterName: 'Chart',
    createdOn: '2024-07-01T10:16:55',
    lastActionOn: '2024-07-01T10:16:55',
    easytoReplicate: '2',
    sufficientDetailsProvided: '3',
    impactOnAssetIntegrity: '4',
    status: 'Approved',
    assignTo: 'Atul',
    timeSaved: '5',
    costSaved: '3',
    lessonType: 'Chart',
  },
];

export enum LearningSource {
  programmeProject = 'Programme / Project',
  training = 'Training',
  conference = 'Conference',
  performanceReview = 'Performance Review',
  incidentReview = 'Incident Review',
  LEAN = 'LEAN',
  ORCOperationReviewCommitte = 'ORC-Operation Review Committe',
  contract = 'Contract (non-confidential)',
  map = 'map',
}
export enum securityClassification {
  restricted = 'Restricted',
  unrestricted = 'Unrestricted',
}
//
