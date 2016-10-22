import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserAccountDirective} from './hairdresserAccount.directive';

export const hairdresserAccount = angular.module('hairdresserAccount', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserAccount', {
      url: '/hairdresserAccount',
      template: '<hairdresserAccount></hairdresserAccount>'
    })
  })
  .directive('hairdresserAccount',hairdresserAccountDirective);

