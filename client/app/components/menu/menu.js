import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {menuDirective} from './menu.directive';
import './menu.scss';
import {servicesHairdresserResourceModule} from './../common/services/hairdresserResource';

export const menu = angular.module('menu', [uiRouter,servicesHairdresserResourceModule.name])
  .config(($stateProvider) => {
    $stateProvider.state('menu', {
      url: '/menu',
      template: '<menu></menu>'
    })
  })
  .directive('menu',menuDirective);

