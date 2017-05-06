import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {verificationaccountDirective} from './verification-account.directive';
import {servicesAccountResourceModule} from './../common/services/accountResource';
import './verification-account.scss';

export const verificationaccount = angular.module('verificationaccount', [uiRouter,servicesAccountResourceModule.name])
  .config(($stateProvider) => {
    $stateProvider.state('verification.account', {
      url: "/verification/account/",
      template: '<verificationaccount></verificationaccount>'
    })
  })
  .directive('verificationaccount',verificationaccountDirective);

