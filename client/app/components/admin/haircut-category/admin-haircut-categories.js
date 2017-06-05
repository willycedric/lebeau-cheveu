

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import uiRouter from 'angular-ui-router';
import template from './admin-haircut-categories.tpl.html';
import moment from 'moment';
import './admin-haircut-categories.scss';
angular.module('admincategorysIndexModule', [uiRouter,
  securityAuthorizationModule.name,  
  servicesAdminResourceModule.name
]);
angular.module('admincategorysIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminhairtcutcategories', {
      url:'/admin/haircut/categories',
      template,
      controller: 'categorysIndexCtrl',
      title: 'Manage categorys',
      resolve: {
        categorys: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /category
          var redirectUrl;         
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){              
              //handles url with query(search) parameter
              return adminResource.gethaircutCategories($location.search());
            }, function(reason){            
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/category': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/category';
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
export const admincategorysIndexModule = angular.module('admincategorysIndexModule').controller('categorysIndexCtrl', ['$scope', '$route', '$location', '$log', 'adminResource', 'categorys','ModalFactory','$window',
  function($scope, $route, $location, $log, adminResource, data,ModalFactory,$window){
   
      var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.categories = data.data;
    };

    $scope.redirectToHaircutCategoryDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl='/admin/haircut/category/'+id.toString();
      }else{
        redirectUrl='/admin/haircut/categories';
      }
      $location.path(redirectUrl);
    };

    var fetchHaircutCategories = function(){
      adminResource.gethaircutCategories($scope.filters).then(function(data){
        deserializeData(data);
        //update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    // $scope methods
    
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchHaircutCategories();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchHaircutCategories();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchHaircutCategories();
    };
  
    var addHaircutCategory = function(category){
      adminResource.addHaircutCategory(category)
      .then(function(data){
           if(data.success){
              $window.location.reload();
            }else if (data.errors && data.errors.length > 0){
              alert(data.errors[0]);
            }else {
              alert('unknown error.');
            }
      }, function(err){
          $scope.add = {};
         $log.error(err);
      });     
    };

    var deleteHaircutCategory = (categoryId) => {
      adminResource.deleteCategory(categoryId)
      .then(function(){

      })
      .finally(function(){

      });

      var updateHaircutCategory = function(category){
        adminResource.updateCategory(category)
        .then(function(){

        })
        .finally(function(){

        });
      };
    }

      
    $scope.LaunchAddHaircutCategoryForm = () => {
      ModalFactory.trigger(this, "newHaircutCategroy.html","custom",function($uibModalInstance,topController){
        this.addHaircutCategory = function(name,state){
          const controledName = name || '';
          const controledDescription = state ||'';
          addHaircutCategory({name:controledName, state:controledDescription});
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

    

    //initialize $scope variables
    deserializeData(data);
  }
]);