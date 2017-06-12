
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-haircut-style.tpl.html';
import _ from 'lodash';
angular.module('adminHaircutStyleDetailModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminHaircutStyleDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminHaircutstyleDetails', {
      url:'/admin/haircut/styles/:id',
      template,
      controller: 'AdminHaircutStyleDetailCtrl',
      title: 'Admin Haircuts style / details',
      resolve: {
        haircut: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id =$stateParams.id || '';
              console.log("haircut style id", id);
              if(id){
                return adminResource.findHaircutStylesEntry(id);
              }else{
                redirectUrl = '/admin/haircut/styles';
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
export const adminHaircutStyleDetailModule = angular.module('adminHaircutStyleDetailModule').controller('AdminHaircutStyleDetailCtrl', ['$scope', '$window','$route', '$location', '$log', 'utility','adminResource', 'ModalFactory','haircut',
  function($scope, $window,$route, $location, $log, utility, adminResource, ModalFactory,data) {
    // local vars
    var deserializeData = function(data){
      $scope.haircut = data.record;
      console.log(JSON.stringify(data, null, 6));
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
          name: $scope.haircut.name,
          isPublished:$scope.haircut.state          
        };
      }else{
          var data = {
          name: $scope.haircut.name,          
          isPublished:$scope.haircut.state         
        };
      }      
      adminResource.updateHaircutStylesEntry($scope.haircut._id, data).then(function(result){
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
    $scope.delete = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteHaircutStylesEntry($scope.haircut._id).then(function(result){
          if(result.success){
            //redirect to admin catalogs index page
            $location.path('/admin/haircut/styles');
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