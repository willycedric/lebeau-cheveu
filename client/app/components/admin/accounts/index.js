
import {adminAccountsIndexModule} from './admin-accounts';
import {adminAccountDetailModule} from './admin-account';
export const adminAccountsModule = angular.module('adminAccountsModule', [
  adminAccountDetailModule.name,
  adminAccountsIndexModule.name
]);