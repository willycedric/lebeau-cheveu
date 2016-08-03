import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {errorDirective} from './error.directive';

export const error = angular.module('error', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('error', {
      url: '/error',
      template: '<error></error>'
    })
  })
  .directive('error',errorDirective);

