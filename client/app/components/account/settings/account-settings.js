import uiRouter from 'angular-ui-router';
import {config} from './../../../config';
import {accountSettingsSocialModule} from './social/index';
import {securityServiceModule} from './../../common/security/security';
import {securityAuthorizationModule} from './../../common/security/authorization';
import {servicesAccountResourceModule} from './../../common/services/accountResource';
import {servicesUtilityModule} from '../../common/services/utility';
import template from './account-settings.tpl.html';
import './account-settings.css';
import './account-settings.scss';
import {AccountSettingController as controller} from './account-settings.controller';
//import {directivesServerErrorModule} from '../../common/directives/serverError';
angular.module('accountSettingsModule', 
  [config.name, 
  accountSettingsSocialModule.name, 
  securityServiceModule.name, 
  securityAuthorizationModule.name, 
  servicesAccountResourceModule.name,
   servicesUtilityModule.name,
   uiRouter
   ]);
export const accountSettingsModule = angular.module('accountSettingsModule').config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider){
  $stateProvider
    .state('accountsettings', {
      url:'/account/settings',
      template,
      controller,
      controllerAs:'vm',
      title: 'Account Settings',
      resolve: {
        accountDetails: ['$q', '$location', 'securityAuthorization', 'accountResource' ,function($q, $location, securityAuthorization, accountResource){
          //get account details only for verified-user, otherwise redirect to /account/verification
          var redirectUrl;
          var promise = securityAuthorization.requireAccountUser()
            .then(accountResource.getAccountDetails, function(reason){
              console.log(reason);
              //rejected either user is unverified or un-authenticated
              redirectUrl = reason === 'unverified-client'? '/account/verification': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
              $location.path(redirectUrl);
              return $q.reject();
            })
            .finally((data)=>{
              
            }); 
          return promise;
        }]
      }
    });
}]);
