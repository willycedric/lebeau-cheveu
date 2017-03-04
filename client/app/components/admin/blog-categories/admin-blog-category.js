
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-blog-category.tpl.html';
angular.module('adminBlogCategoriesDetailModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminBlogCategoriesDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminblogcategoriesid', {
      url:'/admin/blog/categories/:id',
      template,
      controller: 'AdminBlogCategoriesDetailCtrl',
      title: 'Blog Categories / Details',
      resolve: {
        category: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id =$stateParams.id || '';
              if(id){
                return adminResource.findBlogCategory(id);
              }else{
                redirectUrl = '/admin/blog/categories';
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
export const adminBlogCategoriesDetailModule = angular.module('adminBlogCategoriesDetailModule').controller('AdminBlogCategoriesDetailCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'category',
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
        description: $scope.category.description
      };
      adminResource.updateBlogCategory($scope.category._id, data).then(function(result){
        if(result.success){
          deserializeData(result.blogCategory);
          $scope.detailAlerts.push({ type: 'success', msg: 'Changes have been saved.'});
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
        adminResource.deleteBlogCategory($scope.category._id).then(function(result){
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