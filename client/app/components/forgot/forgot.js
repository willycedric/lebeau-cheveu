import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {forgotDirective} from './forgot.directive';

export const forgot = angular.module('forgot', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('forgot', {
      url: '/forgot/:role/:token',
      template: '<forgot></forgot>'
    })
  })
  .directive('forgot',forgotDirective);

