import {servicesCatalogResourceModule} from './../common/services/catalogResource';
import{securityAuthorizationModule} from './../common/security/authorization';
import uiRouter from 'angular-ui-router';
import template from './catalog-details.tpl.html';
import _ from 'lodash';

angular.module('viewCatalogDetailsModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesCatalogResourceModule.name
  ]);
angular.module('viewCatalogDetailsModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('catalogdetails', {
      url:'/catalogs/details/:id',
      template,
      controller: 'CatalogDetailCtrl',
      title: 'Catalogs / Details',
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
      }
    });
}]);
export const viewCatalogDetailsModule =  angular.module('viewCatalogDetailsModule').controller('CatalogDetailCtrl', ['$scope','$rootScope','$q','$route', '$location', 'utility', 'catalogResource','$log', '$stateParams','catalog',
  function($scope,$rootScope,$q,$route, $location, utility, catalogResource, $log,$stateParams,data) { 
    var slideIndex = 0;
    var deserializeData = function(rep){
      $scope.catalog = rep.record; 
      var contents = angular.copy($scope.catalog.contents);
      $scope.open=false;
      $scope.close = true;      
      showSlides(slideIndex,contents);
    };

  
  
  var showSlides = function(n, catalog) {       
      var size = catalog.length;
      var isDisplayed = [];
      if(n < 0){
        slideIndex = size-1;
      }
      if(n >=size){
        slideIndex=0;
      }
      for (var i = 0; i < size; i++) {
          
          isDisplayed.push(false);
      }

      isDisplayed[slideIndex]=true;
      $log.debug("isDisplayed ",isDisplayed[slideIndex]);
       isDisplayed[slideIndex];
    };

   $scope.plusSlides = function(n) {
    showSlides(slideIndex+=n,angular.copy($scope.catalog.contents));
  }

  $scope.currentlyDisplayed = function(n){
      const test= showSlides(n,angular.copy($scope.catalog.contents));
      return test;
  }

  $scope.currentSlide = function(n){   
    return showSlides(slideIndex=n,angular.copy($scope.catalog.contents));
  }

    $scope.openModal= function(n) {
      $log.debug("index ", n);
      $scope.open= !$scope.open;
  //document.getElementById('myModal').style.display = "block";
}

$scope.closeModal= function() {
  $scope.open=!$scope.open;
  
  //document.getElementById('myModal').style.display = "none";
}
$scope.checkEvents = function($event){
  $log.debug("event ",$event.keyCode);
  if($event.keyCode ==27){
    $scope.open =!$scope.open;
  }
}


   deserializeData(data);

   
    
    
  }
]);