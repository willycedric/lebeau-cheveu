import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {accountactivationDirective} from './accountactivation.directive';
import './accountactivation.scss';

export const accountactivation = angular.module('accountactivation', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('accountactivation', {
      url: '/accountactivation/:role/:token',
      template: '<accountactivation></accountactivation>'
    })
  })
  .directive('accountactivation',accountactivationDirective);

