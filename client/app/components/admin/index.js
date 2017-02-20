import {adminModule} from './admin';
import {adminUsersModule} from './users/index';
import {adminAccountsModule} from './accounts/index';
import {adminAdministratorsModule} from './administrators/index';
import {adminAdminGroupsModule} from './admin-groups/index';
import {adminStatusesModule} from './statuses/index';
import {adminCategoriesModule} from './categories/index';
export const  admin = angular.module('admin', [
  adminModule.name,
  adminUsersModule.name,
  adminAccountsModule.name,
  adminAdministratorsModule.name,
  adminAdminGroupsModule.name,
  adminStatusesModule.name,
  adminCategoriesModule.name
]);