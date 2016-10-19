import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {customerDirective} from './customer.directive';
import './product.css';
import template from './product.html';
export const customer = angular.module('customer', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('customer', {
      url: '/customer',
      template: '<customer></customer>',
      resolve:{
      	access:["Access", function(Access){ return Access.isCustomer(2);}]
      }
    })
  })
  .directive('customer',customerDirective)
  .directive('product', ()=>{
    return{
      restrict:'E',
      template,
      replace:true,
    };
  });

