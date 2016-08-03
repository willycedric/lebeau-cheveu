import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {cartDirective} from './cart.directive';

export const cart = angular.module('cart', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('cart', {
      url: '/cart',
      template: '<cart></cart>'
    })
  })
  .directive('cart',cartDirective);

