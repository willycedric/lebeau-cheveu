import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {customerbookingDirective} from './customerbooking.directive';
import './customerbooking.scss';

export const customerbooking = angular.module('customerbooking', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('customerbooking', {
      url: '/customerbooking',
      template: '<customerbooking></customerbooking>'
    })
  })
  .directive('customerbooking',customerbookingDirective);

