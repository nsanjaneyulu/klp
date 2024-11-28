import { Component, ElementRef, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/utils/imports';
import { lessonDetails } from './view-all-lessons-in-detailDto';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAllLessonsInDetailService } from './view-all-lessons-in-detail.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'esa-view-all-lessons-in-detail',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './view-all-lessons-in-detail.component.html',
  styleUrl: './view-all-lessons-in-detail.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class ViewAllLessonsInDetailComponent {
  lessonDetails = lessonDetails;
  requestId: any;
  reUseRequestByIdData: any = [];
  requestByIdData: any;
  lessonImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl: any = '../../../assets/images/imagePreview.png';
  constructor(
    private router: Router,
    private element: ElementRef,
    private activeRoute: ActivatedRoute = inject(ActivatedRoute), 
    private viewAllLessonsInDetailService: ViewAllLessonsInDetailService) {
      this.router.events.subscribe(() => {
        this.element.nativeElement.scrollIntoView();
      });
    }
  ngOnInit(): void {
    this.requestId = this.activeRoute.snapshot.params['id'];
    this.initializeRequestData(this.requestId);
  }
  private initializeRequestData(referrenceId?: any) {
    if (referrenceId) {
      this.getRequestById(referrenceId);
      this.getReUseByRequestId(referrenceId);
    }
  }
  getRequestById(id?: number) {
    this.viewAllLessonsInDetailService.getRequestByIdAsync(id).then((response) => {
      if (response.isSuccess && response.data) {
        this.requestByIdData = response.data;
        this.requestByIdData.identifiedOn = this.convertToGST(this.requestByIdData?.identifiedOn);
        this.lessonImageUrl = this.requestByIdData.fileUrl
        ? this.requestByIdData.fileUrl
        : this.defaultImageUrl;
      }
    });
  }
  convertToGST(dateString: string): string {
    return moment.tz(dateString, "Asia/Dubai").format();
  }
  getReUseByRequestId(id?: number) {
    this.viewAllLessonsInDetailService.getReUseByRequestIdAsync(id).then((response) => {
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

  public downloadFile(doc: any): void {
    if (doc.fileUrl) {
      this.downloadFromUrl(doc.id);
    }
  }
  private downloadFromUrl(id?: any): void {
    this.viewAllLessonsInDetailService.downloadFile(id);
  }
}
