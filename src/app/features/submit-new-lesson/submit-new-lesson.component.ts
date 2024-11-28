import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/utils/imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { SubmitNewLessonService } from './submit-new-lesson.service';
import { Buffer } from 'buffer';
import {
  onlyCharactersValidator,
  alphanumericValidator,
  emailValidator,
} from './custom-validators';
import {
  excludedRoute,
  historyTableColumns,
  LearningSource,
  securityClassification,
} from './submit-new-lessionDto';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { IdetifiedDialogComponent } from '../idetified-dialog/idetified-dialog.component';
import { UserService } from 'src/app/core/services/user.service';
import { RequestModel } from './models/IRequest';
import { IAttachment } from './models/IAttachment';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'esa-submit-new-lesson',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './submit-new-lesson.component.html',
  styleUrls: ['./submit-new-lesson.component.scss'],
  providers: [DialogService, DynamicDialogConfig],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SubmitNewLessonComponent implements OnInit {
  submitLessonForm!: FormGroup | any;
  rowsPerPageOptions: number[] = [10, 20, 30];
  metaDataTableData: any;
  fileTypeValidator: string = '.jpg,.jpeg';
  lessonSelectedFile: string = '';
  historyTableData: any;
  selectedRow: any;
  historyTableColumnsData: any;
  lessonImageUrl: any;
  defaultImageUrl: any = '../../../assets/images/imagePreview.png';
  ref: DynamicDialogRef | undefined;
  workFlowTableData: any;
  sourceDepartmentOptions: any;
  expertiseAreaOptions: any;
  learningApproversOptions: any;
  metaDataTableVisible: boolean = false;
  thumbnailIsValid: boolean = false;
  workFlowTableVisible: boolean = false;
  actionTypeOptions: any;
  getWorkFlowActionsData: any;
  identifiedByData: any;
  securityClassificationOptions: any;
  onlyJPGAllowed: boolean = false;
  isUploadButtonDisabled = true;
  workFlowSelectedFile: string | null = null;
  workFlowImageUrl: string | null = null;
  workFlowAttachment: boolean = false;
  workFlowFileattchment: string = '.pdf, .jpg, .jpeg';
  getProfile: any;
  createRequest!: RequestModel;
  selectedFile: any;
  getRequestByIdData: any;
  referrenceId: any;
  isEdit: boolean = false;
  isView: boolean = false;
  isSubmit: boolean = false;
  isButtonDisabled: boolean = false;
  isIconDisabled: boolean = false;
  historyDataShow: boolean = false;
  documentsDataShow: boolean = false;
  uploadDocumentsData: boolean = false;
  workFlowActionsShow: boolean = false;
  submitButtonShow: boolean = false;
  isApproverTickerDisabled: boolean = false;
  documentsData: any;
  isValidIdentifiedBy: any;
  thumbnailDetailsGet: any;
  expertiseAreaID: any;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private submitNewLessonService: SubmitNewLessonService,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute = inject(ActivatedRoute),
    private dialogService: DialogService = inject(DialogService)
  ) {}
  ngOnInit(): void {
    console.log(this.router.url)
    this.initializeProfile();
    this.initializeRouteParams();
    this.initializeDropdownData();
    this.initializeRequestData();
    this.initializeDocumentsAndHistory();
    this.initializeForm();
  }
  
  private initializeProfile(): void {
    this.userService.profileCache$.subscribe(profile => {
      this.getProfile = profile;
    });
  }
  
  private initializeRouteParams(): void {
    this.referrenceId = this.activeRoute.snapshot.params['id'];
    const path = this.activeRoute.snapshot.routeConfig?.path || '';
    this.isView = path.includes('view-details');
    this.isEdit = path.includes('edit-details');
    this.isSubmit = path.includes('submit-new-lesson');
    if (this.isSubmit) {
      this.workFlowActionsShow = true;
    }
  }
  
  private initializeDropdownData(): void {
    this.getDropdownData();
  }
  
  private initializeRequestData(): void {
    if (this.referrenceId) {
      this.getRequestById(this.referrenceId);
    } else {
      this.getEmployeeDetails();
      this.getWorkFlowActions();
    }
  }
  
  private initializeDocumentsAndHistory(): void {
    this.historyTableColumnsData = historyTableColumns;
  }
  
  private initializeForm(): void {
    this.createRequest = new RequestModel();
    this.initSubmitLessonForm();
  }
  
  disabledControls(): void {
    const controlsToDisable = [
      'requester',
      'requesterEmail',
      'requesterID',
      'requesterJobTitle',
      'requesterDept',
      'source',
      'sourceDepartment',
      'description',
      'securityClassification',
      'keywords',
      'identifiedOn',
      'recommendation',
      'title',
      'identifiedBy',
      'comments',
    ];
    controlsToDisable.forEach(controlName => {
      this.ctrl[controlName]?.disable();
    });
  }
  
  get ctrl() {
    return this.submitLessonForm.controls;
  }
  uploadDoc(fc: HTMLInputElement): void {
    const file = this.getSelectedFile(fc);
    if (!file) return;
  
    if (!this.isValidFile(file)) {
      this.notifyError('Only file types of .pdf, .jpg, and .jpeg are allowed, with a maximum size of 10MB');
      return;
    }
  
    if (this.isDuplicateFile(file)) {
      this.notifyError('This file has already been uploaded.');
      return;
    }
  
    this.convertFileToBase64(file).then(base64Data => {
      this.addAttachment(file, base64Data);
      this.uploadDocumentsData = true;
      this.workFlowSelectedFile = '';
    });
  }
  
  onLessonFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = this.getSelectedFile(input);
    if (file && this.isJpegFile(file) && this.isValidFileSize(file)) {
      this.processLessonImage(file);
    } else {
      this.handleInvalidLessonFile();
    }
    this.thumbnailIsValid = true;
    input.value = '';
  }  

  private getSelectedFile(input: HTMLInputElement): File | null {
    return input.files?.length ? input.files[0] : null;
  }
  
  private isValidFile(file: File): boolean {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg'];
    return allowedExtensions.includes(this.getFileExtension(file)) && this.isValidFileSize(file);
  }
  
  private isValidFileSize(file: File): boolean {
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    return file.size <= maxFileSize;
  }
  
  private getFileExtension(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() || '';
  }
  
  private isJpegFile(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/jpg';
  }
  
  private isDuplicateFile(file: File): boolean {
    return this.createRequest.attachments.some(attachment => attachment.name === file.name);
  }
  
  private convertFileToBase64(file: File): Promise<string> {
    return file.arrayBuffer().then(buf => Buffer.from(buf).toString('base64'));
  }
  
  private addAttachment(file: File, base64Data: string): void {
    const fileExtension = this.getFileExtension(file);
    this.createRequest.attachments.push({
      id: 0,
      localId: this.createRequest.attachments.length + 1,
      activity: this.getWorkFlowActionsData[0].activity,
      uploadBy: this.getProfile.displayName,
      fileType: fileExtension,
      name: file.name,
      data: base64Data,
    } as IAttachment);
  }
  
  private processLessonImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const dataUrl = this.resizeImage(img, 400, 400);
        const base64Data = dataUrl;
        this.createRequest.thumbnail = base64Data;
        this.lessonImageUrl = dataUrl;
        this.isButtonDisabled = false;
      };
    };
    reader.readAsDataURL(file);
    this.lessonSelectedFile = file.name;
    this.onlyJPGAllowed = false;
    this.convertFileToBase64(file).then(base64Data => {
      this.thumbnailDetails(file, base64Data);
    });
  } 
  private thumbnailDetails(file: File, base64Data: string): void {
    const fileExtension = this.getFileExtension(file);
    this.thumbnailDetailsGet = {};
    this.thumbnailDetailsGet = {
      fileType: fileExtension,
      data: base64Data,
      name: file.name,
      isUpdate: false
    } as IAttachment;
  }
  private resizeImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let { width, height } = img;
  
    if (width > height && width > maxWidth) {
      height = Math.floor((height * maxWidth) / width);
      width = maxWidth;
    } else if (height > maxHeight) {
      width = Math.floor((width * maxHeight) / height);
      height = maxHeight;
    }
  
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.7);
  }
  
  private handleInvalidLessonFile(): void {
    this.onlyJPGAllowed = true;
    this.isButtonDisabled = false;
    this.lessonImageUrl = '../../../assets/images/imagePreview.png';
  }
  
  private notifyError(message: string): void {
    this.commonService.notify('Upload', message, 'error');
  }
  
  
  public onWorkFlowFileSelect(event: any) {
    const file = event.target.files[0];
    this.resetFileSelection();
  
    if (!file) {
      return;
    }
  
    const { type: fileType, size: fileSize } = file;
    
    if (fileSize > 10 * 1024 * 1024) { // 10MB
      this.setErrorState();
      return;
    }
  
    if (fileType === 'application/pdf' || fileType === 'image/jpeg') {
      this.processFile(file, fileType);
    } else {
      this.setErrorState();
    }
  }
  
  private processFile(file: File, fileType: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.workFlowImageUrl = fileType === 'application/pdf'
        ? '../../../assets/images/pdfPreview.png'
        : e.target.result;
    };
    reader.readAsDataURL(file);
    
    this.workFlowSelectedFile = file.name;
    this.workFlowAttachment = false;
    this.isUploadButtonDisabled = false;
  }
  
  private resetFileSelection() {
    this.workFlowSelectedFile = '';
    this.workFlowImageUrl = null;
    this.workFlowAttachment = false;
    this.isUploadButtonDisabled = true;
  }
  
  private setErrorState() {
    this.workFlowAttachment = true;
    this.isUploadButtonDisabled = true;
  }
  

  public downloadFile(doc: any): void {
    const anchorElement = this.createAnchorElement();
    if (doc.fileUrl) {
      this.downloadFromUrl(doc.id);
    } else if (doc.data) {
      this.downloadFromBase64(doc.data, doc.fileType, doc.name, anchorElement);
    }
  }
  
  public deleteFile(id: number, localId: number): void {
    if (id === 0) {
      this.deleteLocalFile(localId);
    } else {
      this.confirmAndDeleteFile(id);
    }
  }
  
  private createAnchorElement(): HTMLAnchorElement {
    const anchor = document.createElement('a');
    document.body.appendChild(anchor);
    return anchor;
  }
  
  private downloadFromUrl(id: number): void {
    this.submitNewLessonService.downloadFile(id);
  }
  
  private downloadFromBase64(base64Data: string, fileType: string, fileName: string, anchor: HTMLAnchorElement): void {
    const byteArray = this.base64ToUint8Array(base64Data);
    const blob = new Blob([byteArray], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  }
  
  private base64ToUint8Array(base64Data: string): Uint8Array {
    const binaryString = Buffer.from(base64Data, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  
  private deleteLocalFile(localId: number): void {
    const index = this.createRequest.attachments.findIndex(x => x.localId === localId);
    if (index !== -1) {
      this.createRequest.attachments.splice(index, 1);
    }
  }
  
  private confirmAndDeleteFile(id: number): void {
    this.commonService.askConsent(
      'Delete File',
      'Are you sure to delete this file?',
      () => {
        this.submitNewLessonService.deleteFile(id).then(() => {
          this.loadAttachment();
        });
      }
    );
  }
  
  private loadAttachment(): void {
    this.submitNewLessonService
      .getAttachmentByRequestId(this.createRequest?.id)
      .then(this.handleLoadAttachmentResponse.bind(this))
      .catch(this.handleLoadAttachmentError.bind(this));
  }
  
  private handleLoadAttachmentResponse(resp: any): void {
    if (resp.isSuccess) {
      this.createRequest.attachments = resp.data;
    }
  }
  
  private handleLoadAttachmentError(error: any): void {
    console.error('Error fetching loadAttachment data:', error);
  }

  removeImage(): void {
    this.lessonImageUrl = '';
    this.createRequest.thumbnail = '';
    this.lessonSelectedFile = ''; 
    this.isButtonDisabled = true;
    this.thumbnailIsValid = true;
  }
  get onlyCharacters() {
    return this.submitLessonForm.get('onlyCharacters');
  }
  get alphanumeric() {
    return this.submitLessonForm.get('alphanumeric');
  }
  get alphanumericWithAt() {
    return this.submitLessonForm.get('alphanumericWithAt');
  }
  private initSubmitLessonForm() {
    const formControls = {
      requesterID: ['', [alphanumericValidator(), Validators.required]],
      requester: ['', [onlyCharactersValidator(), Validators.required]],
      requesterJobTitle: ['', Validators.required],
      requesterDept: ['', Validators.required],
      requesterEmail: ['', [emailValidator(), Validators.required]],
      source: ['', Validators.required],
      sourceDepartment: [{ value: '', disabled: true }, Validators.required],
      expertiseArea: [{ value: '', disabled: true }],
      action: ['', Validators.required],
      comments: ['', Validators.required],
      actionComments: [''],
      thumbnail: [''],
      identifiedBy: ['', Validators.required],
      title: ['', Validators.required],
      recommendation: ['', Validators.required],
      identifiedOn: ['', Validators.required],
      keywords: ['', Validators.required],
      securityClassification: ['', Validators.required],
      description: ['', Validators.required],
    };
  
    this.submitLessonForm = this.fb.group(formControls);
  }
  
  toggleRow(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }
  handleApproverTicker(val?: any) {
    this.submitNewLessonService
      .getempStartwithValue(val)
      .then((resp: any) => {
        if (resp.isSuccess && resp.data?.employeeInfoList?.length > 0) {
          const approver = resp.data?.employeeInfoList[0];
          this.identifiedByData = approver;
          this.isValidIdentifiedBy = approver?.email;
          this.ctrl['identifiedBy'].setValue(approver?.employeE_NAME);
        }
      })
  }
  handleApproverDailog() {
    this.ref = this.dialogService.open(IdetifiedDialogComponent, {
      width: '50vw',
      modal: true,
      closable: false,
      data: { name: 'UserbookdailogComponent Data Access' },
    });
    this.ref.onClose.subscribe((data: any) => {
      const approver = data.data;
      this.identifiedByData = approver;
      this.isValidIdentifiedBy = data?.data?.email;
      this.ctrl['identifiedBy'].setValue(approver?.employeE_NAME);
    });
  }
  getDropdownData() {
    this.getSourceDepartment();
    this.getSecurityClarification();
    this.getLearningApprovers();
  }
  private statusImageMap: { [key: string]: string } = {
    'Saved': '../../../assets/images/status/saved.svg',
    'Submit': '../../../assets/images/status/saved.svg',
    'Pending for Learning Approval': '../../../assets/images/status/PendingForLearningApproval.svg',
    'Pending for Learning Approval after Re-Submit': '../../../assets/images/status/PendingForLearningApproval.svg',
    'Pending for Requester Action': '../../../assets/images/status/PendingForRequestorAction.svg',
    'Approved Lesson': '../../../assets/images/status/Approved.svg',
    'Approved': '../../../assets/images/status/Approved.svg',
    'Rejected': '../../../assets/images/status/Rejected.svg',
    'Pending for Expert Review': '../../../assets/images/status/PendingForExpertReview.svg',
    'Best practice': '../../../assets/images/status/Bestpractice.svg',
    'Not a best practice': '../../../assets/images/status/Notabestpractice.svg',
  };
  
  getImageSrc(statusImage?: any): string {
    if (!statusImage) {
      return '../../../assets/images/status/saved.svg'; // Default image if no statusImage is provided
    }
  
    const lessonTypeImage = this.statusImageMap[statusImage.lessonType];
    const statusImageSrc = this.statusImageMap[statusImage.status];
  
    return lessonTypeImage || statusImageSrc || '../../../assets/images/status/saved.svg';
  }
  
  getRequestById(id?: number) {
    this.submitNewLessonService.getRequestByIdAsync(id).then((response?: any) => {
      if (response.isSuccess && response?.data) {
        this.disableRequesterControls();
        this.getRequestByIdData = response?.data;
        this.handleResponseData(response?.data);
      
          if (response?.data?.status === 'Approved' || response?.data?.status === 'Rejected') {
            if (this.isEdit) {
              this.commonService.notify('Load data', 'No action is pending', 'info');
                this.router.navigate(['/my-approval-tasks']);
            }
          }
          if (!this.validateUser(response.data) && !this.router.url.includes(excludedRoute.reportLesson)) {
              this.commonService.notify('Load data', 'Invalid Request Number', 'info');
              this.router.navigate(['/my-submissions']);
          }
      
      }
      else {
        if(response?.error?.status === 200) {
          if(this.isView) {
            this.router.navigate(['/my-submissions']);
          }
          else if(this.isEdit) {
            this.router.navigate(['/my-approval-tasks']);
          }
        }
      }
    });
  }

validateUser(data:any)
{
  let flag = (data.requesterEmail.toLowerCase()=== this.getProfile?.email.toLowerCase() ||
               data.coordinatorsEmails.toLowerCase().includes(this.getProfile?.email.toLowerCase()) || data.expertsEmails.toLowerCase().includes(this.getProfile?.email.toLowerCase()) )
  return flag;
}


  disableRequesterControls() {
    const controls = ['requester', 'requesterEmail', 'requesterID', 'requesterJobTitle', 'requesterDept'];
    controls.forEach(control => this.submitLessonForm.controls[control].disable());
  }
  
  handleResponseData(responseData: any) {
    this.savedResponseDefaultData(responseData);
    this.savedResponseData(responseData);
  }
  
  savedResponseDefaultData(responseData: any) {
    this.getWorkFlowActions(responseData?.wfLevel, responseData?.wfVersion);
    this.metaDataTableVisible = true;
    this.getExpertiseArea(responseData?.sourceDepartmentID);
    this.getLearningApproversTableData(responseData?.sourceDepartmentID);
    this.workFlowTableVisible = true;
    this.expertiseAreaID = true;
    if(responseData?.expertiseAreaID) {
      this.getWorkFlowData(responseData?.expertiseAreaID);
    }
  }
  
  savedResponseData(responseData: any) {
    const identifiedDate = new Date(responseData.identifiedOn);
    this.expertiseAreaID = responseData?.expertiseAreaID
    this.submitLessonForm.patchValue({
      requesterID: responseData?.requesterID,
      requester: responseData?.requester,
      requesterDept: responseData?.requesterDept,
      requesterEmail: responseData?.requesterEmail,
      requesterJobTitle: responseData?.requesterJobTitle,
      title: responseData?.title,
      comments: responseData?.comments,
      description: responseData?.description,
      identifiedBy: responseData?.identifiedBy,
      identifiedOn: identifiedDate,
      keywords: responseData?.keywords,
      recommendation: responseData?.recommendation,
      source: responseData?.source,
      expertiseArea: responseData?.expertiseAreaID,
      sourceDepartment: responseData?.sourceDepartmentID,
      securityClassification: responseData?.securityClassification,
    });
  
    this.documentsData = responseData?.attachments;
    this.lessonImageUrl = responseData?.fileUrl
      ? this.addTimestampToUrl(responseData?.fileUrl)
      : this.defaultImageUrl;
    if (!this.getRequestByIdData?.fileUrl) {
      this.lessonImageUrl = null;
    }
    if (this.isView) {
      this.handleViewMode(responseData);
    } else if (this.isEdit) {
      this.handleEditMode(responseData);
    }
  }
generateTimestamp(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}${month}${year}${hours}${minutes}`;
}
addTimestampToUrl(url: string): string {
  const timestamp = this.generateTimestamp();
  if (url.includes('?')) {
    return `${url}&dt=${timestamp}`;
  } else {
    return `${url}?dt=${timestamp}`;
  }
}
  handleViewMode(responseData: any) {
    this.disabledControls();
    this.showHistoryAndDocuments(responseData?.wfHistory);
    this.uploadDocumentsData = false;
    this.isButtonDisabled = true;
    this.isIconDisabled = false;
    this.isApproverTickerDisabled = true;
    this.submitButtonShow = true;
    this.ctrl['action'].disable();
    this.ctrl['expertiseArea'].disable();
    this.ctrl['actionComments'].disable();
  }
  
  handleEditMode(responseData: any) {
    const status = responseData.status;
    const pendingLearningApproval = ["Pending for Learning Approval after Re-Submit", "Pending for Learning Approval"];
    const pendingExpertReview = ["Pending for Expert Review"];
    const otherStatuses = ["Saved", "Submit", "Pending for Requester Action", "Approved", "Rejected"];
  
    this.showHistoryAndDocuments(responseData?.wfHistory);
    if (pendingLearningApproval.includes(status)) {
      this.disabledControls();
      this.showWorkFlowActions();
      this.ctrl['expertiseArea'].enable();
      this.ctrl['actionComments'].enable();
    } else if (pendingExpertReview.includes(status)) {
      this.disabledControls();
      this.showWorkFlowActions();
      this.ctrl['expertiseArea'].disable();
      this.ctrl['actionComments'].enable();
    } else if (otherStatuses.includes(status)) {
      this.showWorkFlowActions();
      this.ctrl['expertiseArea'].enable();
      this.ctrl['sourceDepartment'].enable();
    }
  }
  
  showHistoryAndDocuments(history: any) {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };
    history.forEach((item: any) => {
        item.created = formatDate(item?.created);
    });
    this.historyTableData = history;
    this.historyDataShow = true;
    this.documentsDataShow = true;
  }
  
  showWorkFlowActions() {
    this.workFlowActionsShow = true;
  }
  
private handleResponse(
  response: any,
  successCallback: (data: any) => void,
  errorCallback: (error: string) => void
) {
  if (response.isSuccess && response.data != null) {
    successCallback(response.data);
  } else {
    errorCallback(response.error);
  }
}

getEmployeeDetails(): void {
  this.submitNewLessonService
    .getEmployeeDetailsAsync(this.getProfile?.email)
    .then((response) => {
      this.handleResponse(
        response,
        (data) => {
          const employee = data[0];
          this.submitLessonForm.patchValue({
            requesterEmail: employee.email,
            requesterID: employee.emP_ID,
            requester: employee.employeE_NAME,
            requesterJobTitle: employee.designation,
            requesterDept: employee.departmenT_NAME,
          });

          ['requester', 'requesterEmail', 'requesterID', 'requesterJobTitle', 'requesterDept'].forEach((control) => {
            this.submitLessonForm.controls[control].disable();
          });
        },
        (error) => {
          console.log("error", error);
          this.commonService.notify('Load data', "Please try again, if any further issues connect with IT", 'error');
        }
      );
    });
}

getWorkFlowActions(wfLevel = 0, wfVersion = 1): void {
  this.submitNewLessonService
    .getWorkFlowActionsAsync(wfVersion, wfLevel)
    .then((response) => {
      this.handleResponse(
        response,
        (data) => {
          this.getWorkFlowActionsData = data;
          this.actionTypeOptions = data.map((item: any) => ({
            label: item?.action,
            value: item?.actionCode,
          }));
        },
        (error) => {
          console.log("error", error);
          this.commonService.notify('Load data', "Please try again, if any further issues connect with IT", 'error');
        }
      );
    });
}

getSourceDepartment(): void {
  this.submitNewLessonService.getAllCommunitiesAsync().then((response) => {
    this.handleResponse(
      response,
      (data) => {
        this.sourceDepartmentOptions = data.map((option: any) => ({
          label: option?.name,
          value: option?.id,
        }));
      },
      (error) => {
        console.log('Load data', error);
      }
    );
  });
}

getLearningApprovers(): void {
  this.learningApproversOptions = Object.keys(LearningSource).map((key) => ({
    label: LearningSource[key as keyof typeof LearningSource],
    value: LearningSource[key as keyof typeof LearningSource],
  }));
}

getSecurityClarification(): void {
  this.securityClassificationOptions = Object.keys(securityClassification).map(
    (key) => ({
      label: securityClassification[key as keyof typeof securityClassification],
      value: securityClassification[key as keyof typeof securityClassification],
    })
  );
}

getExpertiseArea(id?: any): void {
  this.submitNewLessonService.getExpertiseAreaAsync(id).then((response) => {
    this.handleResponse(
      response,
      (data) => {
        this.expertiseAreaOptions = data.map((option: any) => ({
          label: option?.name,
          value: option?.id,
        }));
      },
      (error) => {
        console.log('Load data', error);
      }
    );
  });
}

getLearningApproversTableData(id?: any): void {
  this.submitNewLessonService.getLearningApproversTableDataAsync(id).then((response) => {
    this.handleResponse(
      response,
      (data) => {
        this.metaDataTableData = data;
      },
      (error) => {
        console.log('Load data', error);
      }
    );
  });
}

onSourceDepartmentChange(event?: any): void {
  this.metaDataTableVisible = true;
  this.getExpertiseArea(event.value);
  this.getLearningApproversTableData(event.value);
}

expertiseAreaChange(event?: any): void {
  this.workFlowTableVisible = true;
  this.expertiseAreaID = true;
  this.getWorkFlowData(event.value);
}

onLearningSourceChange(event?: any): void {
  console.log('event', event);
  this.submitLessonForm.get('sourceDepartment')?.enable();
  this.submitLessonForm.get('expertiseArea')?.enable();
}

getWorkFlowData(id?: any): void {
  this.submitNewLessonService.getWorkFlowDataAsync(id).then((response) => {
    this.handleResponse(
      response,
      (data) => {
        this.workFlowTableData = data;
      },
      (error) => {
        console.log('Load data', error);
      }
    );
  });
}
newactivationRequest(): Promise<boolean> {
  const manager = this.ctrl['identifiedBy'].value;
  let managerEmail;

  if (this.referrenceId) {
    managerEmail = this.getRequestByIdData.identifiedByEmail;
  } else {
    managerEmail = this.isValidIdentifiedBy;
  }
  if (!manager) {
    return Promise.resolve(false);
  }
  return this.submitNewLessonService?.getEmployee(managerEmail)
    .then((resp) => {
      if (!resp?.data?.length) {
        return false;
      }
      const isExists = resp?.data.some(
        (obj: any) =>
          obj.employeE_NAME === manager && obj.email === managerEmail
      );
      if (!isExists) {
        return false;
      }
      return true;
    })
}

  submitLessionConfirm() {
    const formControls = this.submitLessonForm?.controls;
    const actionTypeData = this.actionTypeOptions?.find(
        (item: any) => item.value === formControls['action'].value
    );
    const createRequest = {
        action: actionTypeData?.label,
        requesterID: formControls['requesterID'].value,
        requester: formControls['requester'].value,
        requesterEmail: formControls['requesterEmail'].value,
        requesterJobTitle: formControls['requesterJobTitle'].value,
        requesterDept: formControls['requesterDept'].value,
        title: formControls['title'].value,
        description: formControls['description'].value,
        recommendation: formControls['recommendation'].value,
        comments: formControls['comments'].value,
        identifiedBy: formControls['identifiedBy'].value,
        identifiedOn: this.formatDate(formControls['identifiedOn'].value),
        securityClassification: formControls['securityClassification'].value,
        keywords: formControls['keywords'].value,
        source: formControls['source'].value,
        sourceDepartment: formControls['sourceDepartment'].value,
        expertiseArea: formControls['expertiseArea'].value,
        actionComments: formControls['actionComments'].value,
        categoryExpertsEmails: this.getCategoryExpertsEmails(),
        identifiedByEmail: this.identifiedByData?.email || this.getRequestByIdData?.identifiedByEmail,
        expert: this.getCategoryExpertsEmails(),
        coordinator: this.getCoordinatorEmails(),
        actionCode: actionTypeData?.value,
        attachments: this.createRequest?.attachments,
        thumbnail: ""
    };
    this.newactivationRequest().then((result) => {
      if(result) {
        if (this.referrenceId) {
          (createRequest as any).wfVersion = this.getRequestByIdData?.wfVersion;
          (createRequest as any).wfLevel = this.getRequestByIdData?.wfLevel;
          (createRequest as any).id = this.referrenceId;
          this.handleActionType(createRequest, actionTypeData.value);
          this.updateLesson(createRequest);
        } else {
          (createRequest as any).wfVersion = 1;
          (createRequest as any).wfLevel = 0;
          this.createLesson(createRequest);
        }
      } else {
        this.commonService.notify('Error', 'Employee not found Please provide valid employee', 'error');
      }
    });

}

formatDate(dateValue: any): string {
  return moment(dateValue).utcOffset(0, true).format();
}

getCategoryExpertsEmails(): string {
    return this.workFlowTableData?.map((item?: any) => item.email)
        .join('; ');
}

getCoordinatorEmails(): string {
    return this.metaDataTableData
        .map((item?: any) => item.email)
        .join('; ');
}

handleActionType(createRequest: any, actionTypeValue: string) {
    if (actionTypeValue === 'LPAA') {
        createRequest.ExpertRequired = false;
    } else if (actionTypeValue === 'ERAA') {
        createRequest.IsBestPractice = true;
    }
}

updateLesson(createRequest: any) {
    if(this.thumbnailIsValid){
      const isBase64Image = this.lessonImageUrl?.includes("data:image/");
      const hasFileUrl = !!this.getRequestByIdData?.fileUrl;
      if (!this.thumbnailDetailsGet) {
        this.thumbnailDetailsGet = {} as IAttachment;
      }
      const { data, isUpdate } = this.processThumbnailData(isBase64Image, hasFileUrl);
      this.thumbnailDetailsGet.data = data;
      this.thumbnailDetailsGet.isUpdate = isUpdate;
      createRequest.thumbnailDetails = this.thumbnailDetailsGet;
    }
    else {
      if (!this.thumbnailDetailsGet) {
        this.thumbnailDetailsGet = {} as IAttachment;
      }
      this.thumbnailDetailsGet.isUpdate = false;
      createRequest.thumbnailDetails = this.thumbnailDetailsGet;
    }
    if (createRequest.expertiseArea === "" && createRequest.actionCode === "LPAAR") {
      this.commonService.notify('Error', 'Please select an expertise area before proceeding with Approve / Reassign', 'error');
      return;
    }
    this.submitNewLessonService
      .updateLessonaync(createRequest)
      .then((resp: any) => {
          if (resp.isSuccess) {
              this.handleSuccessResponse(createRequest.actionCode);
          }
      })
      .catch((error) => {
          this.handleError('Failed to update lesson', error);
      });
}

createLesson(createRequest: any) {
    const isBase64Image = this.lessonImageUrl?.includes("data:image/");
    if (!this.thumbnailDetailsGet) {
      this.thumbnailDetailsGet = {} as IAttachment;
    }
    const { data, isUpdate } = this.processThumbnailData(isBase64Image, false);
    this.thumbnailDetailsGet.data = data;
    this.thumbnailDetailsGet.isUpdate = isUpdate;
    createRequest.thumbnailDetails = this.thumbnailDetailsGet;
    this.submitNewLessonService
        .createLessonaync(createRequest)
        .then((resp: any) => {
            if (resp.isSuccess) {
                this.handleSuccessResponse(createRequest.actionCode);
            }
        })
        .catch((error) => {
            this.handleError('Failed to create lesson', error);
    });
}
processThumbnailData(isBase64Image: boolean, hasFileUrl: boolean): { data: string | null, isUpdate: boolean } {
  if (this.lessonImageUrl?.includes("assets/images/imagePreview.png")) {
    this.lessonImageUrl = null;
  }
  let data = null;
  let isUpdate = false;
  if (isBase64Image) {
    this.lessonImageUrl = this.lessonImageUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    data = this.lessonImageUrl;
    isUpdate = hasFileUrl ? true : false;
  } else {
    data = hasFileUrl ? null : this.lessonImageUrl;
    isUpdate = hasFileUrl ? true : false;
  }
  return { data, isUpdate };
}

handleSuccessResponse(action: string) {
    const successMessages: { [key: string]: string } = {
        'SR': 'Request saved successfully',
        'LPAS': 'Request sent back successfully',
        'RR': 'Request re-submit successfully',
        'LPAAR': 'Request sent to SME successfully',
        'LPAA': 'Request approved successfully',
        'LPAR': 'Request rejected successfully',
        'ERAA': 'Request approved successfully',
        'ERAR': 'Request rejected successfully',
        'IR': 'Request submitted successfully'
    };

    const successMessage = successMessages[action] || 'Updated Successfully';
    this.commonService.notify('Success', successMessage, 'success');

    if (["SR", "LPAS", "RR", "LPAAR", "LPAA", "LPAR"].includes(action)) {
        this.router.navigate(['/my-approval-tasks']);
    } else if (["IR", "ERAA", "ERAR"].includes(action)) {
        this.router.navigate(['/my-submissions']);
    }
}

handleError(message: string, error: any) {
    this.commonService.notify('Upload Error', message, 'error');
    console.error('Error:', error);
}

  actionChange(eve?: any) {
    console.log("eve", eve);
  }
}
