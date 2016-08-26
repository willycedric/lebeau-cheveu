import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserDirective} from './hairdresser.directive';

export const hairdresser = angular.module('hairdresser', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresser', {
      url: '/hairdresser',
      template: '<hairdresser></hairdresser>',
      resolve:{
      	access:["Access", function(Access){ return Access.hasRole(1);}]
      }
    })
  })
  .directive('hairdresser',hairdresserDirective);

