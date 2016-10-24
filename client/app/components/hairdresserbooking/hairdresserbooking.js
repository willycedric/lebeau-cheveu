import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserbookingDirective} from './hairdresserbooking.directive';
import './hairdresserbooking.scss';

export const hairdresserbooking = angular.module('hairdresserbooking', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserbooking', {
      url: '/hairdresser/booking',
      template: '<hairdresserbooking></hairdresserbooking>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdresserbooking',hairdresserbookingDirective);

