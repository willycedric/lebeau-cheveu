
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-statuses.tpl.html';
angular.module('adminStatusesIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminStatusesIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminstatuses', {
      url:'/admin/statuses',
      template,
      controller: 'StatusesIndexCtrl',
      title: 'Manage Statuses',
      resolve: {
        statuses: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findStatuses($location.search());
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
export const adminStatusesIndexModule = angular.module('adminStatusesIndexModule').controller('StatusesIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'statuses','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.statuses = data.data;
    };

    $scope.redirectToStatusDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl = '/admin/statuses/'+id.toString();
      }else{
        redirectUrl='/admin/statuses/';
      }
      $location.path(redirectUrl);
    }
    var fetchStatuses = function(){
      adminResource.findStatuses($scope.filters).then(function(data){
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
      fetchStatuses();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchStatuses();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchStatuses();
    };
    $scope.addStatus = function(){
      adminResource.addStatus($scope.add).then(function(data){
        $scope.add = {};
        if(data.success){
          $route.reload();
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

    $scope.LaunchAddStatusForm = function(){
      ModalFactory.trigger(this, "newStatus.html",function($uibModalInstance,topController){

        this.addStatus = function(pivot,name){
          topController.name = name || '';
          topController.pivot = pivot ||'';
          topController.addStatus();
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