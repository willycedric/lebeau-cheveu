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
      title:'Account Area',
      resolve: {
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
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
