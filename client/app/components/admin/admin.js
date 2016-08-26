import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {adminDirective} from './admin.directive';

export const admin = angular.module('admin', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('admin', {
      url: '/admin',
      template: '<admin></admin>',
      resolve:{
      	access:["Access", function(Access){ return Access.hasRole(0);}]
      }
    })
  })
  .directive('admin',adminDirective);

