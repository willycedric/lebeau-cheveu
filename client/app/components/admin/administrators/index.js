import {adminAdministratorsIndexModule} from './admin-administrators';
import {adminAdministratorsDetailModule} from './admin-administrator';
export const adminAdministratorsModule = angular.module('adminAdministratorsModule', [
 adminAdministratorsDetailModule.name,
 adminAdministratorsIndexModule.name
]);