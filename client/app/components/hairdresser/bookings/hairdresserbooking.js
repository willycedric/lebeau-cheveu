import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserbookingDirective} from './hairdresserbooking.directive';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import './hairdresserbooking.scss';

export const hairdresserbooking = angular.module('hairdresserbooking', [uiRouter,servicesHairdresserResourceModule.name])
  .config(($stateProvider,securityAuthorizationProvider) => {
    $stateProvider.state('hairdresserbooking', {
      url: '/hairdresser/booking',
      template: '<hairdresserbooking></hairdresserbooking>',
      title:'Mes réservations',
      resolve: {
        bookings: ['$q', '$location', 'securityAuthorization','hairdresserResource',function($q, $location, securityAuthorization,hairdresserResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireHairdresserUser()
            .then(hairdresserResource.getBookings, function(reason){
              console.log('hairdesser reason ', reason);
                //rejected either user is unverified or un-authenticated
                redirectUrl = reason === 'unverified-client'? '/account/verification': '/login';
                return $q.reject();
              })
              .catch(function(){
                redirectUrl = redirectUrl || '/hairdresser';
                $location.path(redirectUrl);
                return $q.reject();
              });
                return promise;
        }]
      }
    })
  })
  .directive('hairdresserbooking',hairdresserbookingDirective);

