

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-accounts.tpl.html';
import moment from 'moment';
import './admin-account.scss';
angular.module('adminAccountsIndexModule', [uiRouter,
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
]);
angular.module('adminAccountsIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminaccounts', {
      url:'/admin/accounts',
      template,
      controller: 'AccountsIndexCtrl',
      title: 'Manage Accounts',
      resolve: {
        accounts: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findAccounts($location.search());
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
export const adminAccountsIndexModule = angular.module('adminAccountsIndexModule').controller('AccountsIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'accounts','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,ModalFactory){
    //// local var
    var getAvailableStatus = function () {
      adminResource.getStatus()
      .then((data)=>{
         $scope.statuses = data.data;
      });
    };
    var deserializeData = function(data){
      var results = data.results;
      getAvailableStatus();
      $scope.items = results.items;
      $scope.pages = results.pages;
      $scope.filters = results.filters;
      $scope.accounts = results.data;
    };

    $scope.redirectToAccountDetails = function(id){
      var redirectUrl ;
      if(id){
        redirectUrl = '/admin/accounts/'+id.toString();
      }else{
        redirectUrl='/admin/accounts/';
      }
      $location.path(redirectUrl);
    };
    var fetchAccounts = function(){
      adminResource.findAccounts($scope.filters).then(function(data){
        deserializeData(data);

        // update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.formatTime = function(timestamp, replace){
      var res = moment(timestamp).from();
      return replace? res.replace('ago', replace): res;
    };
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchAccounts();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchAccounts();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchAccounts();
    };
    $scope.addAccount = function(){
      adminResource.addAccount($scope.fullname).then(function(data){
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
    //Add a new Account in the list 
    $scope.lauchAddAccountForm= function(){
      ModalFactory.trigger(this, "newAccount.html",function($uibModalInstance,topController){

        this.addAccount = function(fullname){
          topController.fullname = fullname || '';
          topController.addAccount();
          $uibModalInstance.close('OK');
        };

        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        this.canSave = function(ngFormCtrl){          
            return  ngFormCtrl.$dirty && ngFormCtrl.$valid;
        };
      });
    };

    // $scope vars
    //select elements and their associating options
    $scope.statuses = [];
    $scope.sorts = [
      {label: "id \u25B2", value: "_id"},
      {label: "id \u25BC", value: "-_id"},
      {label: "name \u25B2", value: "name"},
      {label: "name \u25BC", value: "-name"},
      {label: "company \u25B2", value: "company"},
      {label: "company \u25BC", value: "-company"}
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