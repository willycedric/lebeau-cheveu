import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {securityServiceModule} from './../../common/security/security';
import {securityAuthorizationModule} from './../../common/security/authorization';
import {servicesAccountResourceModule} from './../../common/services/accountResource';
import {servicesUtilityModule} from '../../common/services/utility';
import {accountmessagesDirective} from './accountmessages.directive';
import './accountmessages.scss';

export const accountmessages = angular.module('accountmessages',
 [
		uiRouter,
		securityServiceModule.name, 
	    securityAuthorizationModule.name, 
	    servicesAccountResourceModule.name,
	    servicesUtilityModule.name
])
  .config(($stateProvider) => {
    $stateProvider.state('accountmessages', {
      url: '/account/messages',
      template: '<accountmessages></accountmessages>',
      title:'Mes messages',
      resolve: {
	    accountDetails: ['$q', '$location', 'securityAuthorization', 'accountResource' ,function($q, $location, securityAuthorization, accountResource){
	      //get account details only for verified-user, otherwise redirect to /account/verification
	      var redirectUrl;
	      var promise = securityAuthorization.requireVerifiedUser()
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
  })
  .directive('accountmessages',accountmessagesDirective);

