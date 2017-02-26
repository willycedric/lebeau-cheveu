
import {adminHairdressersIndexModule} from './admin-hairdressers';
import {adminHairdresserDetailModule} from './admin-hairdresser';
export const adminHairdressersModule = angular.module('adminHairdressersModule', [
  adminHairdresserDetailModule.name,
  adminHairdressersIndexModule.name
]);