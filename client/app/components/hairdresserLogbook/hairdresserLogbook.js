import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserLogbookDirective} from './hairdresserLogbook.directive';

export const hairdresserLogbook = angular.module('hairdresserLogbook', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserLogbook', {
      url: '/hairdresserLogbook',
      template: '<hairdresserLogbook></hairdresserLogbook>'
    })
  })
  .directive('hairdresserLogbook',hairdresserLogbookDirective);

