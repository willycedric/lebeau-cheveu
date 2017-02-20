
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import {adminUsersDetailModule} from './admin-user';
import {adminUsersIndexModule} from './admin-users';

export const adminUsersModule = angular.module('adminUsersModule', [
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name,
  adminUsersIndexModule.name,
  adminUsersDetailModule.name
]);