

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-blog-categories.tpl.html';
import './admin-blog-category.scss';
angular.module('adminBlogCategoriesIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminBlogCategoriesIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminblogcategories', {
      url:'/admin/blog/categories',
      template,
      controller: 'BlogCategoriesBlogIndexCtrl',
      title: 'Manage blog BlogCategories',
      resolve: {
        categories: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findBlogCategories($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/admin';
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
export const adminBlogCategoriesIndexModule = angular.module('adminBlogCategoriesIndexModule').controller('BlogCategoriesBlogIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'categories','$window','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,$window,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.categories = data.data;
    };

    $scope.redirectToBlogCategoryDetails = function(id){

      var redirectUrl;
      if(id){
        redirectUrl='/admin/blog/categories/'+id.toString();
      }else{
        redirectUrl='/admin/blog/categories/';
      }
      $location.path(redirectUrl);
    };

    var fetchBlogCategories = function(){
      adminResource.findBlogCategories($scope.filters).then(function(data){
        deserializeData(data);

        //update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchBlogCategories();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchBlogCategories();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchBlogCategories();
    };
    $scope.addBlogCategory = function(category){
      adminResource.addBlogCategory(category).then(function(data){
        if(data.success){
          $window.location.reload();
        }else if (data.errors && data.errors.length > 0){
          alert(data.errors[0]);
        }else {
          alert('unknown error.');
        }
      }, function(e){
        $scope.add = {};
        $log.error(e);
      });
    };

    $scope.LaunchAddBlogCategoryForm = function(){
      ModalFactory.trigger(this, "newBlogCategroy.html","custom",function($uibModalInstance,topController){

        this.addBlogCategory = function(name,description){
          const controledName = name || '';
          const controledDescription = description ||'';
          topController.addBlogCategory({name:controledName, description:controledDescription});
          $uibModalInstance.close('OK');
        };

        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        this.canSave = function(ngFormCtrl){
          console.log('inside this function');
            return  ngFormCtrl.$dirty && ngFormCtrl.$valid;
        }
      });
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