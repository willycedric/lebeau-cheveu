import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresseraccountDirective} from './hairdresseraccount.directive';
import './hairdresseraccount.scss';

export const hairdresseraccount = angular.module('hairdresseraccount', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresseraccount', {
      url: '/hairdresser/account',
      template: '<hairdresseraccount></hairdresseraccount>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdresseraccount',hairdresseraccountDirective);

