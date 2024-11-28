export const historyTableColumns = [
    { field: 'created', header: 'Action Date' },
    { field: 'activity', header: 'Activity' },
    { field: 'actionByName', header: 'Action By' },
    { field: 'outcome', header: 'Outcome' }
  ];
  export enum LearningSource {
    programmeProject = 'Programme / Project',
    training = 'Training',
    conference = 'Conference',
    performanceReview = 'Performance Review',
    incidentReview = 'Incident Review',
    LEAN = 'LEAN',
    ORCOperationReviewCommitte = 'ORC-Operation Review Committe',
    contract = 'Contract (non-confidential)'
  } 
  export enum securityClassification {
    restricted = 'Restricted',
    unrestricted = 'Unrestricted',
  } 


  export enum excludedRoute {
    reportLesson = 'reports-on-lessons',
   
  } 