
import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { SubmitNewLessonService } from '../submit-new-lesson/submit-new-lesson.service';

@Component({
  selector: 'esa-idetified-dialog',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
  templateUrl: './idetified-dialog.component.html',
  styleUrls: ['./idetified-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class IdetifiedDialogComponent {
  @Output() sendApproverObject: EventEmitter<any> = new EventEmitter();
  filteredEmployees: any;
  selectedEmployee: any;
  searchby: string = '';
  employee: any;
  constructor(
    public dialogRef: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private submitNewLessonService: SubmitNewLessonService
  ) 
  {
  }

 
  filterUser(event: any) {
    this.searchby = event;
    this.startWithseacrh();
  }

  startWithseacrh() {
    this.submitNewLessonService
      .getempStartwithValue(this.searchby)
      .then((resp: any) => {
        if (resp.isSuccess) {
          this.filteredEmployees = resp.data.employeeInfoList;
          console.log(this.filteredEmployees)
        }
      });
  }

  closeDialog() {
    this.dialogRef.close({ data: this.selectedEmployee });
  }
  cancelDialog(){
    this.dialogRef.close()
  }
}
