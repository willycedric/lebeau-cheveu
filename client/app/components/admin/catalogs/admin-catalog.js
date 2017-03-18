
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-catalog.tpl.html';
import _ from 'lodash';
angular.module('adminCatalogDetailModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminCatalogDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('admincatalogid', {
      url:'/admin/catalogs/:id',
      template,
      controller: 'AdminCatalogDetailCtrl',
      title: 'Admin catalogs / details',
      resolve: {
        catalog: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id =$stateParams.id || '';
              if(id){
                return adminResource.findCatalog(id);
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
              redirectUrl = redirectUrl || '/account';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const adminCatalogDetailModule = angular.module('adminCatalogDetailModule').controller('AdminCatalogDetailCtrl', ['$scope', '$window','$route', '$location', '$log', 'utility', 'adminResource', 'ModalFactory','catalog',
  function($scope, $window,$route, $location, $log, utility, adminResource, ModalFactory,data) {
    // local vars
    var deserializeData = function(data){
      $scope.catalog = data;
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
          name: $scope.catalog.name,
          description: $scope.catalog.description,
          isPublished:$scope.catalog.isPublished,
          content:content
        };
      }else{
          var data = {
          name: $scope.catalog.name,
          description: $scope.catalog.description,
          isPublished:$scope.catalog.isPublished         
        };
      }      
      adminResource.updateCatalog($scope.catalog._id, data).then(function(result){
        if(result.success){
          deserializeData(result.blogCategory);
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
    $scope.deleteCategory = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteCatalog($scope.catalog._id).then(function(result){
          if(result.success){
            //redirect to admin catalogs index page
            $location.path('/admin/catalogs');
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

    $scope.updateContent = function(content){
        $scope.update(content);
    }

    $scope.deleteContent = function(id,details){
      return adminResource.updateCatalog(id,details);
    };

    $scope.removeContent = function(id){
      ModalFactory.trigger(this, "confirmation.html",function($uibModalInstance,topController){

        this.ok = function(){        
          $log.debug("current id" ,id);
          var data = {
            name: $scope.catalog.name,
            description: $scope.catalog.description,
            isPublished:$scope.catalog.isPublished,
            deletedId:id
          };
          topController.deleteContent(topController.catalog._id,data)
          .then(function(result){
            if(result.success){
               $uibModalInstance.close('OK');
              //topController.triggerSuccessModal('success','entry deleted !');
            }else{
               $uibModalInstance.close('OK');
              //topController.triggerErroModal('error','error during entry deletion!')
            }
          })
          .finally(function(){
            $uibModalInstance.close('OK');
            topController.$window.location.reload();
          });       
          
        };
        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        
      });
    };
    //initialize
    deserializeData(data);
  }
]);