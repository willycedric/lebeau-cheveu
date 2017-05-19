import angular from 'angular';
import {starratingDirective} from './starrating.directive';
import './starrating.scss';
export const rating = angular.module('rating',[])
  .directive('starRating',starratingDirective);
 
