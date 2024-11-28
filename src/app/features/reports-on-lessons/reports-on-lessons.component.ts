import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/utils/imports';
import { SwiperModule } from 'swiper/angular';

@Component({
  selector: 'esa-reports-on-lessons',
  standalone: true,
  imports: [CommonModule, ImportsModule, SwiperModule],
  templateUrl: './reports-on-lessons.component.html',
  styleUrls: ['./reports-on-lessons.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsOnLessonsComponent {
  carouselItems: any[] = [
    { image: 'assets/images/item1.jpg', title: 'AI Robotic Arm', description: 'Lorem ipsum dolor sit dolor ipsum dolor.' },
    { image: 'assets/images/item2.jpg', title: 'Advanced Automation', description: 'Lorem ipsum dolor sit dolor ipsum dolor.' },
    { image: 'assets/images/item3.jpg', title: 'Innovative Solutions', description: 'Lorem ipsum dolor sit dolor ipsum dolor.' },
    { image: 'assets/images/item4.jpg', title: 'Future Technology', description: 'Lorem ipsum dolor sit dolor ipsum dolor.' }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  constructor(

  ) {}
  ngOnInit(): void {

  }

}
