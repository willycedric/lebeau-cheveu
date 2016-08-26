import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {customerDirective} from './customer.directive';

export const customer = angular.module('customer', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('customer', {
      url: '/customer',
      template: '<customer></customer>',
      resolve:{
      	access:["Access", function(Access){ return Access.hasRole(2);}]
      }
    })
  })
  .directive('customer',customerDirective);

