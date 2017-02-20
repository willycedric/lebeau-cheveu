import {adminCategoriesIndexModule} from './admin-categories';
import {adminCategoriesDetailModule} from './admin-category';
export const adminCategoriesModule = angular.module('adminCategoriesModule', [
  adminCategoriesIndexModule.name,
  adminCategoriesDetailModule.name
]);