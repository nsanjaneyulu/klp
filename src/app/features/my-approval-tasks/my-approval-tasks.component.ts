import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '../../shared/utils/imports';
import { MyApprovalTasksService } from './my-approval-tasks.service';
import { UserService } from 'src/app/core/services/user.service';
import { myApprovalListColumnConfig } from './my-approval-tasksDto';
import * as moment from 'moment';
import 'moment-timezone';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'esa-my-approval-tasks',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    RouterModule,
    ImportsModule,
  ],

  templateUrl: './my-approval-tasks.component.html',
  styleUrls: ['./my-approval-tasks.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MyApprovalTasksComponent {
  totalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  rowsPerPageOptions: number[] = [10, 20, 30];
  mytracker: any[] = [];
  showFilters: boolean = false;
  getProfile: any;
  filter: any;
  sortField!: string;
  columns: any[] = myApprovalListColumnConfig;
  private readonly EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(
    private myApprovalTasksService: MyApprovalTasksService,
    private userService: UserService, private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfileDetails();
  }
  loadProfileDetails() {
    this.userService.profileCache$.subscribe((profile) => {
      this.getProfile = profile;
    });
  }

  onfilter(event: any) {
    this.totalRecords = event.filteredValue.length;
  }
  handlePagination(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.rows;
    this.getMyTracker(event);
  }


  getMyTracker(event: any): void {
    this.filter = event?.filters;
    this.pageIndex = event?.first / event?.rows;
    this.pageSize = event.rows;
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

    let sortField = event.sortField;
    if (event.sortField == undefined) {
      sortField = 'referenceNo';
    }

    const payload = {
      filter: filterAsObject,
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize,
      sort: { [sortField]: orderBy == 1 ? 1 : 0 },
    };
    this.myApprovalTasksService.getAllTasksList(payload).then((resp: any) => {
      if (resp.isSuccess) {
        this.mytracker = resp?.data?.requestList;
        this.mytracker?.forEach((obj: any) => {
          obj.createdOn = this.convertToGST(obj?.createdOn)
          obj.identifiedOn = this.convertToGST(obj?.identifiedOn)
          obj.modifiedOn = this.convertToGST(obj?.modifiedOn)
        });
        this.totalRecords = resp?.data?.total;
        this.cdRef.detectChanges();
      }
    });
  }
  convertToGST(dateString: string): string {
    return moment.tz(dateString, "Asia/Dubai").format();
  }
  handlePhaseSplit(phase: string) {
    return phase.split(';');
  }
  handleEmailSplit(emails: string) {
    return emails.split(';');
  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  exporttoExcel(): void {
    const payload = {
      pageIndex: 0,
      pageSize: 0,
      sort: {
        "referenceNo": 1
      },
      filter: {}
    };
    this.myApprovalTasksService.getAllTasksList(payload).then((resp: any) => {
        if (resp.isSuccess) {
          this.mytracker = resp?.data?.requestList;
          this.totalRecords = resp?.data?.total;
          const exportData = this.mytracker?.map((item, index) => ({
            'Sr.No': index + 1,
            ReferenceNumber: "KLP-000"+item.requestNo,
            RequesterName: item.requester,
            CreatedOn: moment(item.createdOn).format('DD-MM-YYYY HH:mm'),
            LastActionOn: moment(item.modifiedOn).format('DD-MM-YYYY HH:mm'),
            Atatus: item.status,
            AssignTo: item.actionUser
          }));
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'MyApprovalTask List');
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, 'MyApprovalTask_List');
        }
      });
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}
