import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {customeraccountDirective} from './customeraccount.directive';
import './customeraccount.scss';

export const customeraccount = angular.module('customeraccount', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('customeraccount', {
      url: '/customeraccount',
      template: '<customeraccount></customeraccount>'
    })
  })
  .directive('customeraccount',customeraccountDirective);

