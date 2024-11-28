import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { ScreenGuard } from './shared/guards/screen.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    data: { breadcrumb: 'Home' },
    title: 'Home',
    canActivate: [AuthGuard, ScreenGuard],
  },
  {
    path: 'view-all-lessons',
    loadComponent: () =>
      import('./core/components/reusable-route/reusable-route.component').then(
        (m) => m.ReusableRouteComponent
      ),
    data: { breadcrumb: 'View All Lessons' },
    title: 'View Details',
    canActivate: [AuthGuard, ScreenGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/view-all-lessons/view-all-lessons.component').then(
            (m) => m.ViewAllLessonsComponent
          ),
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'view-all-lessons-add/:id',
        loadComponent: () =>
          import(
            './features/view-all-lessons-add/view-all-lessons-add.component'
          ).then((m) => m.ViewAllLessonsAddComponent),
        data: {
          breadcrumb: 'View Details',
        },
      },
      {
        path: 'view-all-lessons-details/:id',
        loadComponent: () =>
          import(
            './features/view-all-lessons-in-detail/view-all-lessons-in-detail.component'
          ).then((m) => m.ViewAllLessonsInDetailComponent),
        data: {
          breadcrumb: 'View Details',
        },
      },
    ],
  },
  {
    path: 'view-all-lessons-in-details',
    loadComponent: () =>
      import('./features/view-all-lessons-in-detail/view-all-lessons-in-detail.component').then(
        (m) => m.ViewAllLessonsInDetailComponent
      ),
    data: {
      breadcrumb: 'View All Lessons',
    },
    title: 'View All Lessons',
    canActivate: [AuthGuard, ScreenGuard],
  },
  {
    path: 'submit-new-lesson',
    loadComponent: () =>
      import('./features/submit-new-lesson/submit-new-lesson.component').then(
        (m) => m.SubmitNewLessonComponent
      ),
    data: {
      breadcrumb: 'Submit New Lesson',
    },
    title: 'Submit New Lesson',
    canActivate: [AuthGuard, ScreenGuard],
  },
  {
    path: 'my-approval-tasks',
    loadComponent: () =>
      import('./core/components/reusable-route/reusable-route.component').then(
        (m) => m.ReusableRouteComponent
      ),
    data: { breadcrumb: 'My Approval' },
    title: 'My Approval List',
    canActivate: [AuthGuard, ScreenGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/my-approval-tasks/my-approval-tasks.component').then(
            (m) => m.MyApprovalTasksComponent
          ),
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'edit-details/:id',
        loadComponent: () =>
          import(
            './features/submit-new-lesson/submit-new-lesson.component'
          ).then((m) => m.SubmitNewLessonComponent),
        data: {
          breadcrumb: 'View Details',
        },
      },
      
    ],
  },
  {
    path: 'my-submissions',
    loadComponent: () =>
      import('./core/components/reusable-route/reusable-route.component').then(
        (m) => m.ReusableRouteComponent
      ),
    data: { breadcrumb: 'My Submission' },
    title: 'My Submissions',
    canActivate: [AuthGuard, ScreenGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/my-submissions/my-submissions.component').then(
            (m) => m.MySubmissionsComponent
          ),
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'view-details/:id',
        loadComponent: () =>
          import(
            './features/submit-new-lesson/submit-new-lesson.component'
          ).then((m) => m.SubmitNewLessonComponent),
        data: {
          breadcrumb: 'View Details',
        },
      },
      
    ],
  },
  {
    path: 'reports-on-lessons',
    loadComponent: () =>
      import('./core/components/reusable-route/reusable-route.component').then(
        (m) => m.ReusableRouteComponent
      ),
    data: { breadcrumb: 'Reports On Lessons' },
    title: 'Reports On Lessons',
    canActivate: [AuthGuard, ScreenGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/reports-on-lessons/reports-on-lessons.component').then(
            (m) => m.ReportsOnLessonsComponent
          ),
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'report-view-details/:id',
        loadComponent: () =>
          import(
            './features/submit-new-lesson/submit-new-lesson.component'
          ).then((m) => m.SubmitNewLessonComponent),
        data: {
          breadcrumb: 'View Details',
        },
      },
      
    ],
  },
  {
    path: 'usermanagement',
    loadComponent: () =>
      import('./features/usermanagement/usermanagement.component').then(
        (m) => m.UsermanagementComponent
      ),
    data: {
      breadcrumb: 'User Management',
    },
    title: 'User Management',
    canActivate: [AuthGuard, ScreenGuard],
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./core/components/accessdenied/accessdenied.component').then(
        (m) => m.AccessDeniedComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./core/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'esa', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      enableTracing: false, //debugging only
      initialNavigation: 'enabledNonBlocking',
      urlUpdateStrategy: 'eager',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 0],
      paramsInheritanceStrategy: 'always',
      onSameUrlNavigation: 'reload',
      canceledNavigationResolution: 'replace',
      preloadingStrategy: NoPreloading,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
