

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-gallerys.tpl.html';
import moment from 'moment';
import './admin-gallery.scss';
angular.module('admingallerysIndexModule', [uiRouter,
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
]);
angular.module('admingallerysIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('admingallery', {
      url:'/admin/gallerys',
      template,
      controller: 'gallerysIndexCtrl',
      title: 'Manage gallerys',
      resolve: {
        gallerys: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /gallery
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.getGalleyEntries($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/gallery': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/gallery';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      },
      reloadOnSearch: false
    });
}]);
export const admingallerysIndexModule = angular.module('admingallerysIndexModule').controller('gallerysIndexCtrl', ['$scope', '$route', '$location', '$log', 'adminResource', 'gallerys','ModalFactory',
  function($scope, $route, $location, $log, adminResource, data,ModalFactory){
   
    var deserializeData = function(data){      
       $scope.galleryEntries = data;
       console.log("galleryEntries",JSON.stringify( $scope.galleryEntries, null, 7));
    };    

    $scope.sortEntry = function(entry) {
    var date = new Date(entry.created);
    return date;
};

    //initialize $scope variables
    deserializeData(data);
  }
]);