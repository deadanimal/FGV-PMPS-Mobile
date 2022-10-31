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
        loadChildren: () => import('../page/tree-info/tree-info.module').then(m => m.TreeInfoPageModule)
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
