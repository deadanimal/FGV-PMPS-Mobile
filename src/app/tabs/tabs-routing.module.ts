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
        path: 'tab1/create-new-task',
        loadChildren: () => import('../page/create-new-task/create-new-task.module').then(m => m.CreateNewTaskPageModule)
      },
      {
        path: 'tab1/defect',
        loadChildren: () => import('../page/defect/defect.module').then(m => m.DefectPageModule)
      },
      {
        path: 'tab1/reg-status',
        loadChildren: () => import('../page/register-status/register-status.module').then(m => m.RegisterStatusPageModule)
      },
      {
        path: 'tab1/pollen-preps',
        loadChildren: () => import('../page/pollen-prep-main/pollen-prep-main.module').then(m => m.PollenPrepMainPageModule)
      },
      {
        path: 'tab1/pollen-prep-tandan-list',
        loadChildren: () => import('../page/pollen-prep-tandan-list/pollen-prep-tandan-list.module').then(m => m.PollenPrepTandanListPageModule)
      },
      {
        path: 'tab1/pollen-prep-form',
        loadChildren: () => import('../page/pollen-prep-form/pollen-prep-form.module').then(m => m.PollenPrepFormPageModule)
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
