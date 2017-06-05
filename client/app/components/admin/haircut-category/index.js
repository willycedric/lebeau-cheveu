
import {admincategorysIndexModule} from './admin-haircut-categories';
import {adminHaircutCategoryDetailModule} from './admin-haircut-category';
export const adminHaircutCategoryModule = angular.module('adminHaircutCategoryModule', [
  admincategorysIndexModule.name ,
  adminHaircutCategoryDetailModule.name
]);