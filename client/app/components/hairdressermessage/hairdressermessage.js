import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdressermessageDirective} from './hairdressermessage.directive';
import'./hairdressermessage.scss';
export const hairdressermessage = angular.module('hairdressermessage', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdressermessage', {
      url: '/hairdressermessage',
      template: '<hairdressermessage></hairdressermessage>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdressermessage',hairdressermessageDirective);

