import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {accountactivationDirective} from './accountactivation.directive';
import './accountactivation.scss';
import {servicesAccountResourceModule} from './../common/services/accountResource';

export const accountverification = angular.module('accountverification', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('accountverification', {
      url: '/verification/account/:token',
      template: '<accountactivation></accountactivation>'
    })
  })
  .directive('accountactivation',accountactivationDirective);

