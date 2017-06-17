
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-haircut-category.tpl.html';
import _ from 'lodash';
angular.module('adminHaircutCategoryDetailModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminHaircutCategoryDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminHaircutcategoryDetails', {
      url:'/admin/haircut/category/:id',
      template,
      controller: 'AdminHaircutCategoryDetailCtrl',
      title: 'Admin Haircuts category / details',
      resolve: {
        category: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id =$stateParams.id || '';
              console.log("haircut category id", id);
              if(id){
                return adminResource.findHaircutCategory(id);
              }else{
                redirectUrl = '/admin/catalogs/';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const adminHaircutCategoryDetailModule = angular.module('adminHaircutCategoryDetailModule').controller('AdminHaircutCategoryDetailCtrl', ['$scope', '$window','$route', '$location', '$log', 'utility','adminResource', 'ModalFactory','category',
  function($scope, $window,$route, $location, $log, utility, adminResource, ModalFactory,data) {
    // local vars
    var deserializeData = function(data){
      $scope.category = data;
    };
    var closeAlert = function(alert, ind){
      alert.splice(ind, 1);
    };
    //$scope vars
    $scope.detailAlerts = [];
    $scope.deleteAlerts = [];
    $scope.$window =$window;
    $scope.canSave = utility.canSave;
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.closeDetailAlert = function(ind){
      closeAlert($scope.detailAlerts, ind);
    };
    $scope.closeDeleteAlert = function(ind){
      closeAlert($scope.deleteAlerts, ind);
    };
    $scope.update = function(content){
      $scope.detailAlerts = [];
      if(content){
          var data = {
          name: $scope.category.name,
          isPublished:$scope.category.state          
        };
      }else{
          var data = {
          name: $scope.category.name,          
          isPublished:$scope.category.state         
        };
      }      
      adminResource.updateHaircutCategory($scope.category._id, data).then(function(result){
        if(result.success){
          //deserializeData(result.blogCategory);
          console.log("Category update success", JSON.stringify(result, null,7));
          $scope.detailAlerts.push({ type: 'success', msg: 'Changes have been saved.'});
          $window.location.reload();
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating catalog: ' + x });
      });
    };
    $scope.deleteHaircutCategory = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteHaircutCategory($scope.category._id).then(function(result){
          if(result.success){
            //redirect to admin catalogs index page
            $location.path('/admin/haircut/categories');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting catalog: ' + x });
        });
      }
    };
    
    //initialize
    deserializeData(data);
  }
]);