import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresseraccountDirective} from './hairdresseraccount.directive';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import './hairdresseraccount.scss';

export const hairdresseraccount = angular.module('hairdresseraccount', [uiRouter,servicesHairdresserResourceModule.name])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdresseraccount', {
      url: '/hairdresser/account',
      template: '<hairdresseraccount></hairdresseraccount>',
     resolve: {
        settings: ['$q', '$location', 'securityAuthorization','hairdresserResource', function($q, $location, securityAuthorization,hairdresserResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireHairdresserUser()
            .then(hairdresserResource.getSettings, function(reason){
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
  .directive('hairdresseraccount',hairdresseraccountDirective);

