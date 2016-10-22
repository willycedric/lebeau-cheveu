import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserDirective} from './hairdresser.directive';

export const hairdresser = angular.module('hairdresser', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresser', {
      url: '/hairdresser',
      template: '<hairdresser></hairdresser>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
    .state("hairdresser.MyAccount",{
      url:'/MyAccount',
       template: '<hairdresserAccount></hairdresserAccount>'
    })
    .state("hairdresser.MyBooking",{
      url:'/Booking',
      template:'<hairdresserBooking></hairdresserBooking>'
    })
    .state("hairdresser.Pictures",{
      url:'/Pictures',
      template:'<hairdresserPicture></hairdresserPicture'
    })
    .state("hairdresser.Logbook",{
      url:'/Logbook',
      template:'<hairdresserLogbook></hairdresserLogbook>'
    })
  })
  .directive('hairdresser',hairdresserDirective);

