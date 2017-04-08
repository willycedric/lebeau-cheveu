import {servicesCatalogResourceModule} from './../common/services/catalogResource';
import{securityAuthorizationModule} from './../common/security/authorization';
import uiRouter from 'angular-ui-router';
import template from './catalog-details.tpl.html';
import {CatalogDetailCtrl as controller} from './catalog-details.controller';
import {catalogDetailsDirective} from './catalog-details.directive';
import _ from 'lodash';

angular.module('viewCatalogDetailsModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesCatalogResourceModule.name
  ]);
export const viewCatalogDetailsModule = angular.module('viewCatalogDetailsModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('catalogdetails', {
      url:'/catalogs/details/:id',
      template,
       controller,
       controllerAs:'vm',
      resolve: {
        catalog: ['$q', '$stateParams', '$location', 'securityAuthorization', 'catalogResource', function($q, $stateParams, $location, securityAuthorization, catalogResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireUnPrivilegedUser()
            .then(function(){
              var id = $stateParams.id || '';
              if(id){
                return catalogResource.read(id);
              }else{
                redirectUrl = '/catalogs';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      },
       title: 'Catalogs / Details'
    });
}])
.directive('catalogDetails',catalogDetailsDirective);
