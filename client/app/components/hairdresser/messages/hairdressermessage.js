import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdressermessageDirective} from './hairdressermessage.directive';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import {HairdressermessageController as controller} from './hairdressermessage.controller';
import template from './hairdressermessage.html';
import'./hairdressermessage.scss';
export const hairdressermessage = angular.module('hairdressermessage', [uiRouter])
  .config(($stateProvider,securityAuthorizationProvider) => {
    $stateProvider.state('hairdressermessage', {
      url: '/hairdresser/message',
      template,
      controller,
      title:'Mes messages',
     resolve: {
       messages: ['$q', '$location', 'securityAuthorization','hairdresserResource',function($q, $location, securityAuthorization,hairdresserResource){
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
  .directive('hairdressermessage',hairdressermessageDirective);

