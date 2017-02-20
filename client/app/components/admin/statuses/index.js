import {adminStatusesDetailModule} from './admin-status';
import {adminStatusesIndexModule} from './admin-statuses';
export const adminStatusesModule = angular.module('adminStatusesModule', [
  adminStatusesIndexModule.name,
  adminStatusesDetailModule.name
]);