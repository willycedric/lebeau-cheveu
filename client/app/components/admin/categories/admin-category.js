
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-category.tpl.html';
angular.module('adminCategoriesDetailModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminCategoriesDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('admincategoriesid', {
      url:'/admin/categories/:id',
      template,
      controller: 'AdminCategoriesDetailCtrl',
      title: 'Categories / Details',
      resolve: {
        category: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id =$stateParams.id || '';
              if(id){
                return adminResource.findCategory(id);
              }else{
                redirectUrl = '/admin/categories';
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
export const adminCategoriesDetailModule = angular.module('adminCategoriesDetailModule').controller('AdminCategoriesDetailCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'category',
  function($scope, $route, $location, $log, utility, adminResource, data) {
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
    $scope.canSave = utility.canSave;
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.closeDetailAlert = function(ind){
      closeAlert($scope.detailAlerts, ind);
    };
    $scope.closeDeleteAlert = function(ind){
      closeAlert($scope.deleteAlerts, ind);
    };
    $scope.update = function(){
      $scope.detailAlerts = [];
      var data = {
        name: $scope.category.name,
        pivot: $scope.category.pivot
      };
      adminResource.updateCategory($scope.category._id, data).then(function(result){
        if(result.success){
          deserializeData(result.category);
          $scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.detailAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function(x){
        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating category: ' + x });
      });
    };
    $scope.deleteCategory = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteCategory($scope.category._id).then(function(result){
          if(result.success){
            //redirect to admin categories index page
            $location.path('/admin/categories');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting category: ' + x });
        });
      }
    };

    //initialize
    deserializeData(data);
  }
]);