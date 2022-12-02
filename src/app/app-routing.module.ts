import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./page/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./page/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'main-task',
    loadChildren: () => import('./page/main-task/main-task.module').then( m => m.MainTaskPageModule)
  },
  {
    path: 'tree-info',
    loadChildren: () => import('./page/tree-info/tree-info.module').then( m => m.TreeInfoPageModule)
  },
  {
    path: 'register-status',
    loadChildren: () => import('./page/register-status/register-status.module').then( m => m.RegisterStatusPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./page/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'task-status',
    loadChildren: () => import('./page/task-status/task-status.module').then( m => m.TaskStatusPageModule)
  },
  {
    path: 'finished-task',
    loadChildren: () => import('./page/finished-task/finished-task.module').then( m => m.FinishedTaskPageModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./page/qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },
  {
    path: 'new-task-info',
    loadChildren: () => import('./page/new-task-info/new-task-info.module').then( m => m.NewTaskInfoPageModule)
  },
  {
    path: 'start-work-find',
    loadChildren: () => import('./page/start-work-find/start-work-find.module').then( m => m.StartWorkFindPageModule)
  },
  {
    path: 'create-new-task',
    loadChildren: () => import('./page/create-new-task/create-new-task.module').then( m => m.CreateNewTaskPageModule)
  },
  {
    path: 'pollen-prep-main',
    loadChildren: () => import('./page/pollen-prep-main/pollen-prep-main.module').then( m => m.PollenPrepMainPageModule)
  },
  {
    path: 'offline-mode',
    loadChildren: () => import('./page/offline-mode/offline-mode.module').then( m => m.OfflineModePageModule)
  },
  // {
  //   path: 'test-page',
  //   loadChildren: () => import('./page/test-page/test-page.module').then( m => m.TestPagePageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
