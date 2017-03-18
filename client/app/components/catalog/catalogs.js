
import {servicesCatalogResourceModule} from './../common/services/catalogResource';
import{securityAuthorizationModule} from './../common/security/authorization';
import uiRouter from 'angular-ui-router';
import template from './catalogs.tpl.html';
import _ from 'lodash';
import './catalog.scss';
angular.module('catalogIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesCatalogResourceModule.name,
     
     ]);
angular.module('catalogIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('catalogs', {
      url:'/catalogs',
      template,
      controller: 'TestCtrl',
      title: 'Catalogs',
      resolve: {
        data: ['$q', '$location', '$log', 'securityAuthorization', 'catalogResource', function($q, $location, $log, securityAuthorization, catalogResource){                   
          var redirectUrl;
          var promise = securityAuthorization.requireUnPrivilegedUser()
            .then(function(){
              //handles url with query(search) parameter
              return catalogResource.findCatalogs($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/home';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/home';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const catalogIndexModule = angular.module('catalogIndexModule').controller('TestCtrl', ['$scope', '$state','$window', '$location', '$log', 'catalogResource','data',
  function($scope,$state, $window, $location, $log, catalogResource,data){
    // local var
    $log.debug(data);
    var deserializeData = function(data){
      $scope.items = data.results.items;
      $scope.pages = data.results.pages;
      $scope.filters = data.results.filters;
      $scope.statuses = data.statuses;
      $scope.catalogs=data.results.data;
    };

    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      //fetchBlogs();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      //fetchBlogs();
    };
    
    $scope.redirecToCatalogDetails = function(id){
      $log.debug("inside the function redirecToCatalogDetails ", id);
      var redirectUrl = null;
      if(id)
        redirectUrl = "/catalogs/details/"+id.toString();
      else 
        redirectUrl ="/catalogs"
      $location.path(redirectUrl);
    };

    // $scope vars
    //select elements and their associating options
    $scope.sorts = [
      {label: "id \u25B2", value: "_id"},
      {label: "id \u25BC", value: "-_id"},
      {label: "name \u25B2", value: "name"},
      {label: "name \u25BC", value: "-name"}
    ];    
   
    $scope.limits = [
      {label: "10 items", value: 10},
      {label: "20 items", value: 20},
      {label: "50 items", value: 50},
      {label: "100 items", value: 100}
    ];

    //initialize $scope variables
    deserializeData(data);
    
     
  }
]);