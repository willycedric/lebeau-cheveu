
import {adminHaircutStyleDetailModule} from './admin-haircut-style';
import {adminhaircutstyleIndexModule} from './admin-haircut-styles';
export const adminHaircutStyle = angular.module('adminHaircutStyle', [  
  adminhaircutstyleIndexModule.name,
  adminHaircutStyleDetailModule.name
]);