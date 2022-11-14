// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://fgv.prototype.com.my/api',
  login:'/login',
  taskByUserId:'/tugasan/user/',
  allTaskList:'/tugasan/',
  taskById:'/tugasan/',
  task:'/tugasan/',
  profileById:'/profil/',
  tandanInfo:'/tandan/',
  treeInfo:'/pokok/',
  bagging:'/bagging/',
  crossPolination:'/control_pollination/',
  qualityControl:'/quality_control/',
  storageUrl:'https://fgv.prototype.com.my/storage/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
