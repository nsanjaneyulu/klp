import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/utils/imports';
import { lessonDetails } from './view-all-lessons-addDto';
import { CommonService } from '../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewAllLessonsAddService } from './view-all-lessons-add.service';
import { UserService } from 'src/app/core/services/user.service';
import { Buffer } from 'buffer';
import * as moment from 'moment';
import 'moment-timezone';

export class ReUseModel {
  requestId?: number;
  rateEtr?: number;
  rateSdp?: number;
  rateIai?: number;
  savingCost?: number;
  savingTime?: number;
  comments?: string;
  createdOn?: string;
  isActive?: boolean;
  reuserId?: string;
  reuserName?: string;
  reuserJobTitle?: string;
  reuserDept?: string;
  reuserEmail?: string;
  attachments: any [] = [];
}

@Component({
  selector: 'esa-view-all-lessons-add',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './view-all-lessons-add.component.html',
  styleUrl: './view-all-lessons-add.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class ViewAllLessonsAddComponent {
  lessonDetails = lessonDetails;
  workFlowImageUrl: any;
  actionSelected: any;
  fileTypeValidator: string = '.jpg,';
  submitReUseForm: FormGroup | any;
  getProfile: any;
  requestId: any;
  workFlowSelectedFile: string | null = null;
  workFlowAttachment: any;
  isUploadButtonDisabled: any;
  createRequest!: ReUseModel;
  workFlowFileattchment: string = '.pdf, .jpg, .jpeg';
  reUseRequestByIdData: any;
  requestByIdData: any;
  lessonImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl: any = '../../../assets/images/imagePreview.png';
  constructor(private commonService: CommonService, private router: Router, private fb: FormBuilder, private viewAllLessonsAddService: ViewAllLessonsAddService, private userService: UserService,  private activeRoute: ActivatedRoute = inject(ActivatedRoute),) {}
  ngOnInit(): void {
    this.initializeProfile();
    this.getEmployeeDetails();
    this.initSubmitLessionForm();
    this.initializeRequestData();
  }
  
  private initializeProfile(): void {
    this.userService.profileCache$.subscribe(profile => {
      this.getProfile = profile;
    });
    this.requestId = this.activeRoute.snapshot.params['id'];
    this.initializeRequestData(this.requestId);
  }
  public onActionFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.actionSelected = file.name;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.workFlowImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    this.actionSelected = file.name;
    if (file.length == 0) {
      this.commonService.notify(
        'Upload error',
        "You're not allowed to upload files in the current screening status",
        'error'
      );
    }
  }
  viewLessonDetails() {
    this.router.navigate(['/view-all-lessons-in-details']);
  }
  initSubmitLessionForm() {
    this.createRequest = new ReUseModel();
    this.submitReUseForm = this.fb.group({
      reuserId: ['', Validators.required],
      reuserName: ['', Validators.required],
      reuserDept: ['', Validators.required],
      reuserJobTitle: ['', Validators.required],
      reuserEmail: ['', Validators.required],
      rateEtr: ['', Validators.required],
      rateIai: ['', Validators.required],
      rateSdp: ['', Validators.required],
      savingCost: [''],
      savingTime: [''],
      comments: [''],
    });
  }
  onlyAllowNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
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
    this.viewAllLessonsAddService
      .getEmployeeDetailsAsync(this.getProfile?.email)
      .then((response) => {
        this.handleResponse(
          response,
          (data) => {
            const employee = data[0];
            this.submitReUseForm.patchValue({
              reuserEmail: employee.email,
              reuserId: employee.emP_ID,
              reuserName: employee.employeE_NAME,
              reuserJobTitle: employee.designation,
              reuserDept: employee.departmenT_NAME,
            });
  
            ['reuserName', 'reuserEmail', 'reuserId', 'reuserJobTitle', 'reuserDept'].forEach((control) => {
              this.submitReUseForm.controls[control].disable();
            });
          },
          (error) => {
            this.commonService.notify('Load data', error, 'error');
          }
        );
      });
  }

  reUseLessonConfirm() {
    const formControls = this.submitReUseForm.controls;
    const createRequest = {
      requestId: parseInt(this.requestId),
      rateEtr: formControls['rateEtr'].value,
      rateSdp: formControls['rateSdp'].value,
      rateIai: formControls['rateIai'].value,
      savingCost: parseInt(formControls['savingCost'].value),
      savingTime: parseInt(formControls['savingTime'].value),
      comments: formControls['comments'].value,
      reuserId: formControls['reuserId'].value,
      reuserName: formControls['reuserName'].value,
      reuserJobTitle: formControls['reuserJobTitle'].value,
      reuserDept: formControls['reuserDept'].value,
      reuserEmail: formControls['reuserEmail'].value,
      attachments: this.createRequest?.attachments
    };
    this.createReUseLesson(createRequest);
}
createReUseLesson(createRequest: any) {
  this.viewAllLessonsAddService
      .createReUseLessonaync(createRequest)
      .then((resp: any) => {
          if (resp.isSuccess) {
            this.router.navigate(['/view-all-lessons']);
          }
      })
      .catch(() => {

      });
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




private createAnchorElement(): HTMLAnchorElement {
  const anchor = document.createElement('a');
  document.body.appendChild(anchor);
  return anchor;
}

private downloadFromUrl(id?: any): void {
  this.viewAllLessonsAddService.downloadFile(id);
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
      this.viewAllLessonsAddService.deleteFile(id).then(() => {
        this.loadAttachment();
      });
    }
  );
}

private loadAttachment(): void {
  this.viewAllLessonsAddService
    .getAttachmentByRequestId(this.requestId)
    .then(this.handleLoadAttachmentResponse.bind(this))
    .catch(this.handleLoadAttachmentError.bind(this));
}

private handleLoadAttachmentResponse(resp: any): void {
  if (resp.isSuccess) {
    this.createRequest.attachments = resp.data;
  } else {
    console.error('Failed to fetch loadAttachment data:', resp.message);
  }
}

private handleLoadAttachmentError(error: any): void {
  console.error('Error fetching loadAttachment data:', error);
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
    this.workFlowSelectedFile = '';
  });
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

private isDuplicateFile(file: File): boolean {
  return this.createRequest.attachments.some(attachment => attachment.name === file.name);
}

private convertFileToBase64(file: File): Promise<string> {
  return file.arrayBuffer().then(buf => Buffer.from(buf).toString('base64'));
}
private notifyError(message: string): void {
  this.commonService.notify('Upload', message, 'error');
}
private addAttachment(file: File, base64Data: string): void {
  const fileExtension = this.getFileExtension(file);
  this.createRequest.attachments.push({
    id: 0,
    localId: this.createRequest.attachments.length + 1,
    uploadBy: this.getProfile.displayName,
    fileType: fileExtension,
    name: file.name,
    data: base64Data,
  } as any);
}
private initializeRequestData(referrenceId?: any) {
  console.log("referrenceId", referrenceId);
  if (referrenceId) {
    this.getRequestById(referrenceId);
    this.getReUseByRequestId(referrenceId);
  }
}
getRequestById(id?: number) {
  this.viewAllLessonsAddService.getRequestByIdAsync(id).then((response) => {
    if (response.isSuccess && response.data) {
      this.requestByIdData = response.data;
      this.requestByIdData.identifiedOn = this.convertToGST(this.requestByIdData?.identifiedOn);
      this.lessonImageUrl = this.requestByIdData.fileUrl
        ? this.requestByIdData.fileUrl
        : this.defaultImageUrl;
    }
  });
}
getReUseByRequestId(id?: number) {
  this.viewAllLessonsAddService.getReUseByRequestIdAsync(id).then((response) => {
    if (response.isSuccess) {
      if (response.data) {
          this.reUseRequestByIdData = response.data;
      } else {
          this.reUseRequestByIdData = {
              rateEtr: 0,
              rateSdp: 0,
              rateIai: 0,
              reused: 0,
              costSaved: 0,
              timeSaved: 0
          };
      }
  }
  
  });
}
convertToGST(dateString: string): string {
  return moment.tz(dateString, "Asia/Dubai").format();
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
}
