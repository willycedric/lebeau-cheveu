import {adminAadminGroupsIndexModule} from './admin-groups';
import {adminAdminGroupsDetailModule} from './admin-group';

export const adminAdminGroupsModule = angular.module('adminAdminGroupsModule', [
  adminAadminGroupsIndexModule.name,
  adminAdminGroupsDetailModule.name
]);