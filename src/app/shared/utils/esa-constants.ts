export namespace ApiUrls {
  export const signin: string = '/saml2/login';
  export const signout: string = '/saml2/logout';
  export const profile: string = '/v1/profile';
  export const upladimage = `/v1/file`;
  export const getSourceDepartment = `/v1/submitNewLession/getSourceDepartment`;
  export const getLearningApprovers = `/v1/submitNewLession/getLearningApprovers`;
  export const getExpertiseArea = `/v1/lessons/getcategoryexpertsasync`;
  export const getEmployeeDetails = `/v1/employee`;
  export const getLearningApproversTable = `/v1/lessons/getlearningapproversasync`;
  export const getrequestbyid = `/v1/lessons/getrequestbyidasync`;
  export const getreusebyrequestid = `/v1/reuse/getreusebyrequestid`;
  export const getallstatuslist = `/v1/lessons/getallstatus`;
  export const getlessontype = `/v1/lessons/getlessontype`;
  export const getrequestordepartment = `/v1/lessons/getrequestordepartment`;
  export const getAllCommunities = `/v1/lessons/getallcommunitiesasync`;
  export const getWorkFlowData = `/v1/lessons/getcategoryexpertsapproversasync`;
  export const getWorkFlowActions = `/v1/lessons/getworkflowactions`;
  export const createLesson = `/v1/lessons/createLesson`;
  export const updatelesson = `/v1/lessons/updatelesson`;
  export const getAllTasks = `/v1/ApprovalTasks/getAllEsTask`;
  export const getactivecontributors = `/v1/publish/getactivecontributors`;
  export const reuselesson = `/v1/reuse/reuselesson`;
  export const getpublishedlesson = `/v1/publish/getpublishedlesson`;
  export const getallroles = `/v1/publish/getallroles`;
  export const getAllTasksList = `/v1/approvaltasks/getalltaskslist`;
  export const getmysubmissionlist = `/v1/submission/getmysubmissionlist`;
  export const getallReports = `/v1/reports/getallreports`;
  export const downloadFile = `/v1/file/downloadfile`;
  export const getAttachmentByRequestId = (id: number): string =>
    `/v1/request/getAttachmentByRequestId/${id}`;
  export const deleteFile = (id: number): string =>
    `/v1/request/deleteAttachment/${id}`;
  export const getemployeeStartwith = (searchValue: string): string =>
    `/v1/employee/startswith/${searchValue}`;
  export const getemployeebyValue=(searchValue:string):string => `/v1/employee/${searchValue}`;

  export const searchEMPInfor = (
    empId: string,
    email: string,
    depId: string,
    fromCache: boolean
  ): string =>
    `/v1/appointment/getemployeedetails?employeeId=${empId}&email=${email}&deptId=${depId}&fromCache=${fromCache}`;
  export const usermanagement: string = '/v1/usermanagement';
  export const addUserToRole: string = '/v1/usermanagement';
  export const deleteUserRole: string = '/v1/usermanagement/removeuser';
}

//use the for sidebar navigation//
export const NavigationMenuItemConfig = [
  {
    key: 'HM',
    displayName: 'Home',
    value: {
      path: '/',
      icon: 'esa-icon esa-icon-home',
    },
  },
  {
    key: 'VL',
    displayName: 'View All Lessons',
    value: {
      path: '/view-all-lessons',
      icon: 'esa-icon esa-icon-view-all-lessons',
    },
  },

  {
    key: 'SN',
    displayName: 'Submit New Lesson',
    value: {
      path: '/submit-new-lesson',
      icon: 'esa-icon esa-icon-new-lesson',
    },
  },

  {
    key: 'AT',
    displayName: 'My Approval Tasks',
    value: {
      path: '/my-approval-tasks',
      icon: 'esa-icon esa-icon-my-approval-tasks',
    },
  },

  {
    key: 'MS',
    displayName: 'My Submissions',
    value: {
      path: '/my-submissions',
      icon: 'esa-icon esa-icon-my-submissions',
    },
  },
  {
    key: 'RL',
    displayName: 'Reports On Lessons',
    value: {
      path: '/reports-on-lessons',
      icon: 'esa-icon esa-icon-reports-on-lessons',
    },
  },
  {
    key: 'UM',
    value: {
      path: '/usermanagement',
      icon: 'esa-icon esa-icon-usermanagement',
    },
  },
];
