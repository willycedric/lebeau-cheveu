import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserlogbookDirective} from './hairdresserlogbook.directive';
import './hairdresserlogbook.scss';
export const hairdresserlogbook = angular.module('hairdresserlogbook', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserlogbook', {
      url: '/hairdresser/logbook',
      template: '<hairdresserlogbook></hairdresserlogbook>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdresserlogbook',hairdresserlogbookDirective);
