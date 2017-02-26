

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-groups.tpl.html';
import './admin-group.scss';
angular.module('adminAadminGroupsIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminAadminGroupsIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminadmingroups', {
      url:'/admin/admin-groups',
      template,
      controller: 'AdminGroupsIndexCtrl',
      title: 'Manage Admin Groups',
      resolve: {
        groups: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findAdminGroups($location.search());
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
export const adminAadminGroupsIndexModule = angular.module('adminAadminGroupsIndexModule').controller('AdminGroupsIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'groups','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.groups = data.data;
    };

    $scope.redirectToGroupDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl = '/admin/admin-groups/'+id.toString();
      }else{
        redirectUrl='/admin/admin-groups/';
      }
      $location.path(redirectUrl);
    };

    var fetchAdminGroups = function(){
      adminResource.findAdminGroups($scope.filters).then(function(data){
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
      fetchAdminGroups();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchAdminGroups();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchAdminGroups();
    };
    $scope.addGroup = function(){
      adminResource.addAdminGroup($scope.groupname).then(function(data){
        $scope.groupname = '';
        if(data.success){
          $route.reload();
        }else if (data.errors && data.errors.length > 0){
          alert(data.errors[0]);
        }else {
          alert('unknown error.');
        }
      }, function(e){
        $scope.groupname = '';
        $log.error(e);
      });
    };
    $scope.launchAddGroupForm = function(){
      ModalFactory.trigger(this, "newGroup.html",function($uibModalInstance,topController){

        this.addGroup = function(fullname){
          topController.fullname = fullname || '';
          topController.addGroup();
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