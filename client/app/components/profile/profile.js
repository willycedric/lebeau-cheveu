import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {profileDirective} from './profile.directive';

export const profile = angular.module('profile', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('profile', {
      url: '/profile',
      template: '<profile></profile>'
    })
  })
  .directive('profile',profileDirective);

