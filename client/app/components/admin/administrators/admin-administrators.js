
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-administrators.tpl.html';
import './admin-administrator.scss';
angular.module('adminAdministratorsIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminAdministratorsIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminadministrators', {
      url:'/admin/administrators',
      template,
      controller: 'AdministratorsIndexCtrl',
      title: 'Manage Administrators',
      resolve: {
        administrators: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findAdministrators($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
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
export const adminAdministratorsIndexModule = angular.module('adminAdministratorsIndexModule').controller('AdministratorsIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'administrators','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.administrators = data.data;
    };

    var fetchAdministrators = function(){
      adminResource.findAdministrators($scope.filters).then(function(data){
        deserializeData(data);

        //update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    $scope.redirecToAdministratorDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl = '/admin/administrators/'+id.toString();
      }else{
        redirectUrl='/admin/administrators/'
      }
      $location.path(redirectUrl);
    };
    
    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchAdministrators();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchAdministrators();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchAdministrators();
    };
    $scope.addAdmin = function(){
      adminResource.addAdministrator($scope.fullname).then(function(data){
        $scope.fullname = '';
        if(data.success){
          $route.reload();
        }else if (data.errors && data.errors.length > 0){
          alert(data.errors[0]);
        }else {
          alert('unknown error.');
        }
      }, function(e){
        $scope.fullname = '';
        $log.error(e);
      });
    };
    $scope.lauchAddAdminForm = function(){
      ModalFactory.trigger(this, "newAdmin.html",function($uibModalInstance,topController){

        this.AddAdmin = function(fullname){
          topController.fullname = fullname || '';
          topController.AddAdmin();
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