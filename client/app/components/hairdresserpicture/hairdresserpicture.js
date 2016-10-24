import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserpictureDirective} from './hairdresserpicture.directive';
import './hairdresserpicture.scss';

export const hairdresserpicture = angular.module('hairdresserpicture', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserpicture', {
      url: '/hairdresser/picture',
      template: '<hairdresserpicture></hairdresserpicture>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdresserpicture',hairdresserpictureDirective);

