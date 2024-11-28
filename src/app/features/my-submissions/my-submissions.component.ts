import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '../../shared/utils/imports';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MySubmissionsService } from './my-submissions.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  LearningSource,
  securityClassification,
} from './my-submissionsDto';
import * as moment from 'moment';
import 'moment-timezone';
import { CommonService } from 'src/app/shared/services/common.service';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'esa-my-submissions',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    RouterModule,
    ImportsModule,
  ],
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MySubmissionsComponent {
  totalRecords: number = 0;
  currentdate = new Date();
  pageNumber: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  rowsPerPageOptions: number[] = [10, 20, 30];
  mySubmissionsListData: any[] = [];
  showFilters: boolean = false;
  submitLessonForm: FormGroup | any;
  getProfile: any;
  learningApproversOptions: any;
  securityClassificationOptions: any;
  statusOptions: any;
  sourceDepartmentOptions: any;
  lessonTypeOptions: any;
  expertiseAreaOptions: any;
  filter: any;
  globalFilter: any;
  getRequestorDepartmentOptions: any;
  originalFiltersList: any;
  private readonly EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(
    private fb: FormBuilder,
    private mySubmissionsService: MySubmissionsService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private commonservice: CommonService,
  ) {}

  ngOnInit(): void {
    this.getDropdownData();
    this.initSubmitLessionForm();
  }

  getDropdownData() {
    this.userService.profileCache$.subscribe(profile => {
      this.getProfile = profile;
    });
  
    const statusOptions$ = this.mySubmissionsService.getallstatusListAsync();
    const sourceDepartmentOptions$ = this.mySubmissionsService.getAllCommunitiesAsync();
    const lessonTypeOptions$ = this.mySubmissionsService.getLessonTypeAsync();
    const requestorDepartmentOptions$ = this.mySubmissionsService.getRequestorDepartmentAsync(this.getProfile.email);
  
    forkJoin({
      statusOptions: statusOptions$,
      sourceDepartmentOptions: sourceDepartmentOptions$,
      lessonTypeOptions: lessonTypeOptions$,
      requestorDepartmentOptions: requestorDepartmentOptions$,
    }).subscribe({
      next: ({ statusOptions, sourceDepartmentOptions, lessonTypeOptions, requestorDepartmentOptions }) => {
        if (statusOptions.isSuccess && statusOptions.data) {
          this.statusOptions = statusOptions.data.map(option => ({
            label: option.value,
            value: option.value,
          }));
        }
  
        if (sourceDepartmentOptions.isSuccess && sourceDepartmentOptions.data) {
          this.sourceDepartmentOptions = sourceDepartmentOptions.data.map(option => ({
            label: option.name,
            value: option.id,
          }));
        }
  
        if (lessonTypeOptions.isSuccess && lessonTypeOptions.data) {
          this.lessonTypeOptions = lessonTypeOptions.data.map(option => ({
            label: option.name,
            value: option.name,
          }));
        }
  
        if (requestorDepartmentOptions.isSuccess && requestorDepartmentOptions.data) {
          this.getRequestorDepartmentOptions = requestorDepartmentOptions.data.map(option => ({
            label: option.value,
            value: option.value,
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching dropdown data', err);
      }
    });
    this.learningApproversOptions = Object.keys(LearningSource).map(key => ({
      label: LearningSource[key as keyof typeof LearningSource],
      value: LearningSource[key as keyof typeof LearningSource],
    }));
  
    this.securityClassificationOptions = Object.keys(securityClassification).map(key => ({
      label: securityClassification[key as keyof typeof securityClassification],
      value: securityClassification[key as keyof typeof securityClassification],
    }));
  }
  

  getMyTracker(event?: any): void {
    this.filter = event?.filters;
    this.pageIndex = event?.first / event?.rows;
    this.pageSize = event?.rows;
    const orderBy = (event.sortField == undefined) ? 1 :((event.sortOrder === 1) ? 0 : 1);

    let filterAsObject = Object.entries(this.filter).reduce(
      (acc, [key, { value }]: any) => {
        let filter = key;
        return {
          ...acc,
          ...(value && { [filter]: value }), // Use sortField as key here//
        };
      },
      {}
    );

    let sortField = event?.sortField;
    if (event?.sortField == undefined) {
      sortField = 'referenceNo';
    }

    const payload = {
      filter: filterAsObject,
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize,
      sort: { [sortField]: orderBy },
      globalFilter: this.globalFilter,
    };
    this.mySubmissionsService
      .getAllSubmissionsListAsync(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.mySubmissionsListData = resp?.data?.requestList;
          this.totalRecords = resp?.data?.total;
          this.mySubmissionsListData.forEach((obj: any) => {
            obj.createdOn = this.convertToGST(obj?.createdOn)
            obj.identifiedOn = this.convertToGST(obj?.identifiedOn)
            obj.modifiedOn = this.convertToGST(obj?.modifiedOn)
          });
        } else {
          this.commonservice.notify(
            'Error',
            'Please try again, if any further issues connect with IT',
            'error'
          );
        }
      });
  }
  convertToGST(dateString: string): string {
    return moment.tz(dateString, "Asia/Dubai").format();
  }
  onfilter(event: any) {
    this.totalRecords = event.filteredValue?.length;
  }
  handlePagination(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.rows;
    this.getMyTracker(event);
  }

  handleEmailSplit(emails: string) {
    return emails.split(';');
  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  initSubmitLessionForm() {
    this.submitLessonForm = this.fb.group({
      referenceNo: [''],
      recommendation: [''],
      description: [''],
      title: [''],
      comments: [''],
      keywords: [''],
      securityClassification: [''],
      status: [''],
      lessonType: [''],
      source: [''],
      requestorDepartment: [''],
      sourceDepartment: [''],
      identifiedFrom: [''],
      identifiedTo: [''],
      createdFrom: [''],
      createdTo: [''],
      expertiseArea: [''],
      requesterDept: [''],
    });
  }
  onLearningSourceChange(event?: any) {
    console.log('event', event);
    this.enableFormControls(['sourceDepartment', 'expertiseArea']);
  }
  
  onSourceDepartmentChange(event?: any) {
    this.getExpertiseArea(event?.value);
  }
  
  getExpertiseArea(id?: any) {
    this.mySubmissionsService.getExpertiseAreaAsync(id).then((response) => {
      if (response.isSuccess && response.data) {
        this.expertiseAreaOptions = response?.data?.map((option: any) => ({
          label: option.name,
          value: option.id,
        }));
      }
    });
  }
  
  advancedSearch() {
    const filterValues = this.extractFormattedDates();
    const gLobalFiterFormValues: any = {
      referenceNo: this.ctrl['referenceNo'].value,
      title: this.ctrl['title'].value,
      description: this.ctrl['description'].value,
      recommendation: this.ctrl['recommendation'].value,
      comments: this.ctrl['comments'].value,
      keywords: this.ctrl['keywords'].value,
      securityClassification: this.ctrl['securityClassification'].value,
      status: this.ctrl['status'].value,
      lessonType: this.ctrl['lessonType'].value,
      source: this.ctrl['source'].value,
      requesterDept: this.ctrl['requesterDept'].value,
      sourceDepartment: this.ctrl['sourceDepartment'].value,
      expertiseArea: this.ctrl['expertiseArea'].value,
      ...filterValues
    };
  
    this.globalFilter = Object.keys(gLobalFiterFormValues).reduce((filteredObj: any, key) => {
      const value = gLobalFiterFormValues[key];
      if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        filteredObj[key] = value;
      }
      return filteredObj;
    }, {});
  
    const payload = {
      globalFilter: this.globalFilter,
      pageIndex: 0,
      pageSize: 0,
      sort: {
        "referenceNo": 1
      },
      filter: {}
    };
  
    this.mySubmissionsService.getAllSubmissionsListAsync(payload).then((resp: any) => {
      if (resp.isSuccess) {
        this.mySubmissionsListData = resp?.data?.requestList;
        this.originalFiltersList = this.mySubmissionsListData;
        this.totalRecords = resp?.data?.total;
        this.cdRef.detectChanges();
      }
    });
  }
  simpleFormatDate(dateValue: any): string {
    return moment(dateValue).utcOffset(0, true).format();
  }

  private extractFormattedDates() {
    const dateFields = [
      'identifiedFrom',
      'identifiedTo',
      'createdFrom',
      'createdTo',
    ];
    const formattedDates: { [key: string]: string | undefined } = {};
    dateFields.forEach((field) => {
      const value = this.submitLessonForm?.controls[field]?.value;
      if (value) {
        formattedDates[field] = moment(value).utcOffset(0, true).format();;
      }
    });
    return formattedDates;
  }

 
  enableFormControls(controlNames: string[]) {
    controlNames.forEach(name => this.submitLessonForm.get(name)?.enable());
  }
  
  get ctrl() {
    return this.submitLessonForm.controls;
  }
  clearFilter() {
    this.submitLessonForm.reset();
    this.advancedSearch();
    this.cdRef.detectChanges();
    const payload = {
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 10,
      sortField: undefined,
      sortOrder: 1
    };
    this.getMyTracker(payload);

  }
  exporttoExcel(): void {
    if(this.originalFiltersList?.length == 0) {
    const payload = {
      pageIndex: 0,
      pageSize: 0,
      sort: {
        "referenceNo": 1
      },
      filter: {}
    };
    this.mySubmissionsService
      .getAllSubmissionsListAsync(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.mySubmissionsListData = resp?.data?.requestList;
          this.exportExcelFilterdata(this.mySubmissionsListData)
          this.totalRecords = resp?.data?.count;
          
        }
      });
    }
    else {
      this.exportExcelFilterdata(this.originalFiltersList)
      this.totalRecords = this.originalFiltersList?.length;
    }
  }
  exportExcelFilterdata(data?: any) {
    const exportData = data?.map((item?: any, index?: any) => ({
      'Sr.No': index + 1,
      ReferenceNumber: "KLP-000"+item?.requestNo,
      RequesterName: item?.requester,
      CreatedOn: moment(item?.createdOn).format('DD-MM-YYYY HH:mm'),
      LastActionOn: moment(item?.modifiedOn).format('DD-MM-YYYY HH:mm'),
      Status: item?.status,
      AssignTo: item?.actionUser
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MySubmissions List');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'MySubmissions_List');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}
