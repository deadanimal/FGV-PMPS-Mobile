import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../page/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'tab2',
        // loadChildren: () => import('../page/tree-info/tree-info.module').then(m => m.TreeInfoPageModule)
        loadChildren: () => import('../page/qr-scanner/qr-scanner.module').then(m => m.QrScannerPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../page/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
      },
      {
        path: 'tab1/main-task',
        loadChildren: () => import('../page/main-task/main-task.module').then(m => m.MainTaskPageModule)
      },
      {
        path: 'tab1/task-status',
        loadChildren: () => import('../page/task-status/task-status.module').then(m => m.TaskStatusPageModule)
      },
      {
        path: 'tab1/task-finished',
        loadChildren: () => import('../page/finished-task/finished-task.module').then(m => m.FinishedTaskPageModule)
      },
      {
        path: 'tab1/new-task',
        loadChildren: () => import('../page/new-task-info/new-task-info.module').then(m => m.NewTaskInfoPageModule)
      },
      {
        path: 'tab1/start-work-find',
        loadChildren: () => import('../page/start-work-find/start-work-find.module').then(m => m.StartWorkFindPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/tab1/',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
