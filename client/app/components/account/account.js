//import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import {securityAuthorizationModule} from './../common/security/authorization';
import {CustomerController as controller} from './account.controller';
import './account-menu.scss';
import './account.css';
import './account.scss';
import template from './account.tpl.html';
import menuTemplate from './account-menu.html';


angular.module('accountIndexModule', [uiRouter,securityAuthorizationModule.name]);
export const accountIndexModule =  angular.module('accountIndexModule')
  .config(($stateProvider,securityAuthorizationProvider)=>{
    $stateProvider.state('account',{
      url:'/account',
      template,
      controller,
      controllerAs:'vm',
      title:'Mon compte',
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
    });
  });
  angular.module('accountIndexModule')
  .directive('customerMenu',()=>{
    return {
      restrict:'E',
      template:menuTemplate,
      replace:true
    };
  });
