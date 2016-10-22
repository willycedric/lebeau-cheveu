import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserBookingDirective} from './hairdresserBooking.directive';

export const hairdresserBooking = angular.module('hairdresserBooking', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserBooking', {
      url: '/hairdresserBooking',
      template: '<hairdresserBooking></hairdresserBooking>'
    })
  })
  .directive('hairdresserBooking',hairdresserBookingDirective);

