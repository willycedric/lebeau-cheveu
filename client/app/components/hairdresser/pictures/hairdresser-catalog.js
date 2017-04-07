
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './hairdresser-catalog.tpl.html';
import moment from 'moment';
import {hairdressercatalogDirective} from './hairdresser-catalog.directive'
angular.module('hairdresserHaircutCatalogModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesHairdresserResourceModule.name
  ]);
export const hairdresserHaircutCatalogModule = angular.module('hairdresserHaircutCatalogModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('hairdressercatalog', {
      url:'/hairdresser/pictures/:id/:name',
      template:'<hairdressercatalog></hairdressercatalog>',
      title: 'Hairdressers / Details'
    });
}])
.directive('hairdressercatalog',hairdressercatalogDirective);
