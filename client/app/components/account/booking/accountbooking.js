import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {accountbookingDirective} from './accountbooking.directive';
import {securityServiceModule} from './../../common/security/security';
import {securityAuthorizationModule} from './../../common/security/authorization';
import {servicesAccountResourceModule} from './../../common/services/accountResource';
import {servicesUtilityModule} from '../../common/services/utility';
import {AccountbookingController as controller} from './accountbooking.controller';
import template from './accountbooking.tpl.html';
import './accountbooking.scss';

export const accountbooking = angular.module('accountbooking', 
	[
		uiRouter,
		securityServiceModule.name, 
	    securityAuthorizationModule.name, 
	    servicesAccountResourceModule.name,
	    servicesUtilityModule.name
	]
)
.config(($stateProvider) => {
$stateProvider.state('accountbooking', {
  url: '/account/booking',
  controller,
  controllerAs:'vm',
  template,
  title:'Mes réservations',
 resolve: {
    accountDetails: ['$q', '$location', 'securityAuthorization', 'accountResource' ,function($q, $location, securityAuthorization, accountResource){
      //get account details only for verified-user, otherwise redirect to /account/verification
      var redirectUrl;
      var promise = securityAuthorization.requireAccountUser()
        .then(accountResource.getAccountDetails, function(reason){
          //rejected either user is unverified or un-authenticated
          redirectUrl = reason === 'unverified-client'? '/account/verification': '/login';
          return $q.reject();
        })
        .catch(function(){
          redirectUrl = redirectUrl || '/account';
          $location.path(redirectUrl);
          return $q.reject();
        });
      return promise;
    }]
  }
})
});


