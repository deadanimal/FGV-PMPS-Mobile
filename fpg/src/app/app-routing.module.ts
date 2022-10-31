import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
