import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/utils/imports';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import {
  metaDataTableDataConfig,
  learningOptionsConfig,
  viewAllLessonsConfig,
  LearningSource,
  securityClassification,
} from './view-all-lessonsDto';
import { ViewAllLessonsService } from './view-all-lessons.service';
import * as moment from 'moment';
import 'moment-timezone';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'esa-view-all-lessons',
  standalone: true,
  imports: [
    CommonModule,
    ImportsModule,
    InputGroupAddonModule,
    InputGroupModule,
  ],
  templateUrl: './view-all-lessons.component.html',
  styleUrls: ['./view-all-lessons.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ViewAllLessonsComponent implements OnInit {
  lessons = viewAllLessonsConfig;
  activeIndex: number = 0;
  visible: boolean = false;
  learningOptions = learningOptionsConfig;
  rolesOptions: any;
  selectedRole: any;
  metaDataTableData = metaDataTableDataConfig;
  @Input() text: any;
  public limit: number = 100;
  public isCollapsed: boolean[] = [];
  submitLessonForm: FormGroup | any;
  coursefilter: any;
  coursepageIndex: number = 1;
  coursepageSize: number = 10;
  courseorderBy: any;

  totalRecords: number = 0;
  coursetotalRecords: number = 0;
  currentdate = new Date();
  pageNumber: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  orderBy: number = 0;
  rowsPerPageOptions: number[] = [10, 20, 30];
  courserowsPerPageOptions: number[] = [10, 20, 30];
  mytracker: any[] = [];
  showFilters: boolean = false;
  getProfile: any;
  filter: any;
  globalFilters: any;
  sortField!: string;
  sortOrder!: number;
  securityClassificationOptions: any;
  statusOptions: any;
  sourceDepartmentOptions: any;
  lessonTypeOptions: any;
  expertiseAreaOptions: any;
  learningApproversOptions: any;
  getRequestorDepartmentOptions: any;
  viewAllLessonData: any;
  globalFilter: any;
  getViewAllLessonList: any;
  searchQuery: any;
  lessonImageUrl: any;
  defaultImageUrl: any = '../../../assets/images/imagePreview.png';
  // Define the Excel MIME type
  private readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private fb: FormBuilder,
    private viewAllLessonsService: ViewAllLessonsService,
    private commonservice: CommonService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
  }

  changeTab(event?: any) {
    if(event === 1) {
      this.selectedRole = this.rolesOptions[0]?.value;
      this.getMyTracker();
    }
  }

  private initializeForm(): void {
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
      learningSource: [''],
      requestorDepartment: [''],
      sourceDepartment: [''],
      source: [''],
      createdFrom: [''],
      requesterDept: [''],
      identifiedFrom: [''],
      identifiedTo: [''],
      createdTo: [''],
      expertiseArea: [''],
    });
  }

  private loadInitialData(): void {
    this.loadRoles();
    this.loadDropdownData();
  }

  private loadRoles(): void {
    this.getallRoles();
  }

  private loadDropdownData(): void {
    this.getDropdownData();
  }

  onLearningSourceChange(event?: any) {
    console.log('event', event);
    this.enableFormControls(['sourceDepartment', 'expertiseArea']);
  }

  onSourceDepartmentChange(event?: any) {
    this.loadExpertiseArea(event.value);
  }

  private loadExpertiseArea(id?: any) {
    this.viewAllLessonsService.getExpertiseAreaAsync(id).then((response) => {
      if (response.isSuccess && response.data) {
        this.expertiseAreaOptions = response.data.map((option: any) => ({
          label: option.name,
          value: option.id,
        }));
      }
    });
  }

  private getDropdownData() {
    this.userService.profileCache$.subscribe(
      (profile) => (this.getProfile = profile)
    );

    this.learningApproversOptions = this.mapObjectToOptions(LearningSource);
    this.securityClassificationOptions = this.mapObjectToOptions(
      securityClassification
    );

    this.loadStatusOptions();
    this.loadSourceDepartmentOptions();
    this.loadLessonTypeOptions();
    this.loadRequestorDepartmentOptions();
  }

  private mapObjectToOptions(obj: { [key: string]: string }) {
    return Object.keys(obj).map((key) => ({
      label: obj[key as keyof typeof obj],
      value: obj[key as keyof typeof obj],
    }));
  }

  private loadStatusOptions() {
    this.viewAllLessonsService.getallstatusListAsync().then((response) => {
      if (response.isSuccess && response.data) {
        this.statusOptions = response.data.map((option: any) => ({
          label: option.value,
          value: option.value,
        }));
      }
    });
  }

  private loadSourceDepartmentOptions() {
    this.viewAllLessonsService.getAllCommunitiesAsync().then((response) => {
      if (response.isSuccess && response.data) {
        this.sourceDepartmentOptions = response.data.map((option: any) => ({
          label: option.name,
          value: option.id,
        }));
      }
    });
  }

  private loadLessonTypeOptions() {
    this.viewAllLessonsService.getLessonTypeAsync().then((response) => {
      if (response.isSuccess && response.data) {
        this.lessonTypeOptions = response.data.map((option: any) => ({
          label: option.name,
          value: option.name,
        }));
      }
    });
  }

  private loadRequestorDepartmentOptions() {
    this.viewAllLessonsService
      .getRequestorDepartmentAsync(this.getProfile.email)
      .then((response) => {
        if (response.isSuccess && response.data) {
          this.getRequestorDepartmentOptions = response.data.map(
            (option: any) => ({
              label: option.value,
              value: option.value,
            })
          );
        }
      });
  }

  private getallRoles() {
    this.viewAllLessonsService.getallroles().then((response) => {
      if (response.isSuccess && response.data) {
        this.rolesOptions = response.data.map((item: any) => ({
          label: item.name,
          value: item.name,
        }));
        this.selectedRole = this.rolesOptions[0]?.value;
      }
      else {
        this.commonservice.notify(
          'Error',
          'Please try again, if any further issues connect with IT',
          'error'
        );
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  private enableFormControls(controlNames: string[]) {
    controlNames.forEach((name) => this.submitLessonForm.get(name)?.enable());
  }

  exporttoExcel(): void {
    const exportData = this.mytracker.map((item, index) => ({
      'Sr.No': index + 1,
      Name: item.name,
      Contributors: item.activities,
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contributors List');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Contributors_List');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
  viewLessonDetails(lesson?: any) {
    console.log('lesson', lesson);
    this.router.navigate(['/view-all-lessons-in-details']);
  }
  viewReUseLesson(lesson?: any) {
    console.log('lesson', lesson);
    this.router.navigate(['/view-all-lessons-add']);
  }
  toggleReadMore(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }
  
  getDisplayedDescription(description: string, index: any): string {
    const processedDescription = this.insertWordBreaks(description);
    if (this.isCollapsed[index] === undefined) {
      this.isCollapsed[index] = true;
    }
    return this.isCollapsed[index] && processedDescription.length > this.limit
      ? `${processedDescription.slice(0, this.limit)}...`
      : processedDescription;
  }
  
  insertWordBreaks(text: string, maxWordLength: number = 20): string {
    return text.replace(new RegExp(`(\\S{${maxWordLength}})`, 'g'), '$1\u200B');
  }
  
  shouldShowReadMoreLink(description: string): boolean {
    return description.length > this.limit;
  }
  
  get displayedText() {
    return this.isCollapsed ? this.text.slice(0, this.limit) : this.text;
  }

  get showReadMore() {
    return this.text?.length > this.limit;
  }
  getMyTracker(event?: any): void {
    if (event) {
      this.filter = event.filters;
      this.pageIndex = Math.floor(event.first / event.rows);
      this.pageSize = event.rows;
      this.orderBy = event.sortOrder === 1 ? 1 : 0;
    }

    const filterAsObject = Object.entries(this.filter || {}).reduce(
      (acc, [key, { value }]: any) => (value ? { ...acc, [key]: value } : acc),
      {}
    );

    const sortField = event?.sortField ?? 'activities';

    const payload = {
      globalFilter: { role: this.selectedRole },
      filter: filterAsObject,
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize,
      sort: { [sortField]: this.orderBy },
    };

    this.viewAllLessonsService
      .getactivecontributors(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.mytracker = resp.data.contributors;
          this.totalRecords = resp.data.total;

          this.mytracker.forEach((obj: any) => {
            obj.a_From_Required = moment.utc(obj.a_From_Required).toDate();
            obj.a_To_Required = moment.utc(obj.a_To_Required).toDate();
          });
        }
      });
  }

  getViewAllLesson(event?: any): void {
    const filterValues = this.extractFormattedDates();
    const globalFilter = this.createGlobalFilter(filterValues);
    if (event) {
      this.coursefilter = event.filters;
      this.coursepageIndex = Math.floor(event.first / event.rows);
      this.coursepageSize = event.rows;
      this.courseorderBy = event.sortOrder === 1 ? 1 : 0;
    }
    const filterAsObject = Object.entries(this.coursefilter || {}).reduce(
      (acc, [key, { value }]: any) => {
        return value ? { ...acc, [key]: value } : acc;
      },
      {}
    );
    const sortField = event?.sortField ?? 'referenceNo';

    const payload = {
      globalFilter: globalFilter,
      filter: filterAsObject,
      pageIndex: this.coursepageIndex + 1,
      pageSize: this.coursepageSize,
      sort: { [sortField]: this.courseorderBy },
    };

    this.viewAllLessonsService
      .getViewAllLessonAsync(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.getViewAllLessonList = resp.data.publishedLessons;
          this.getViewAllLessonList.forEach((obj: any) => {
            obj.createdOn = this.convertToGST(obj.createdOn)
            obj.identifiedOn = this.convertToGST(obj.identifiedOn)
            obj.modifiedOn = this.convertToGST(obj.modifiedOn)
          });
          // this.isCollapsed = this.getViewAllLessonList.map(() => true);
          this.coursetotalRecords = resp.data.count;
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
  getLessonImageUrl(lesson: any): string {
    return lesson.fileUrl ? lesson.fileUrl : this.defaultImageUrl;
  }
  onfilter(event: any) {
    this.totalRecords = event.filteredValue.length;
  }
  handlePagination(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.rows;
    this.getMyTracker(event);
  }

  courseonfilter(event: any) {
    this.coursetotalRecords = event.filteredValue.length;
  }
  coursehandlePagination(event: any): void {
    this.coursepageIndex = event.pageIndex;
    this.coursepageSize = event.rows;
    this.getViewAllLesson(event);
  }

  advancedSearch() {
    const filterValues = this.extractFormattedDates();
    const globalFilter = this.createGlobalFilter(filterValues);

    const payload = {
      globalFilter,
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize,
    };

    this.viewAllLessonsService
      .getViewAllLessonAsync(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.getViewAllLessonList = resp.data.publishedLessons;
          this.coursetotalRecords = resp.data.count;
          this.visible = false;
        }
      });
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

  private createGlobalFilter(formValues: any) {
    const filterValues = {
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
      ...formValues,
    };

    return Object.keys(filterValues).reduce((filteredObj: any, key) => {
      const value = filterValues[key];

      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        filteredObj[key] = value;
      }
      return filteredObj;
    }, {});
  }

  get ctrl() {
    return this.submitLessonForm.controls;
  }
  clearFilter() {
    this.submitLessonForm.reset();
    this.advancedSearch();
    this.cdRef.detectChanges();
  }
  roleChange(eve?: any) {
    this.selectedRole = eve.value;
    this.getMyTracker();
  }

  performSearch(): void {
    const payload = {
      globalFilter: {title: this.searchQuery?.trim()},
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize,
    };
    this.viewAllLessonsService
      .getViewAllLessonAsync(payload)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.getViewAllLessonList = resp.data.publishedLessons;
          this.coursetotalRecords = resp.data.count;
          this.visible = false;
        }
      });

  }
  
}
