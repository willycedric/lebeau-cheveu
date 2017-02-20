import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserlogbookDirective} from './hairdresserlogbook.directive';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import './hairdresserlogbook.scss';
export const hairdresserlogbook = angular.module('hairdresserlogbook', [uiRouter,servicesHairdresserResourceModule.name])
  .config(($stateProvider,securityAuthorizationProvider) => {
    $stateProvider.state('hairdresserlogbook', {
      url: '/hairdresser/logbook',
      template: '<hairdresserlogbook></hairdresserlogbook>',
      constrollerAs:'vm',
      title:'Mon agenda',
      resolve: {
       access: ['$q', '$location', 'securityAuthorization', 'hairdresserResource',function($q, $location, securityAuthorization,hairdresserResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireHairdresserUser()
            .then(hairdresserResource.getAccountDetails, function(reason){
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
      }, //end resolve
    })//end state provider
  })//end config 
  .directive('hairdresserlogbook',hairdresserlogbookDirective)
  