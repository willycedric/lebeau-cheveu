import {securityAuthorizationModule} from './../common/security/authorization';
import {servicesAdminResourceModule} from './../common/services/adminResource';
import uiRouter from 'angular-ui-router';
import template from './admin.tpl.html';
import './admin.scss';
angular.module('adminModule', [uiRouter, securityAuthorizationModule.name, servicesAdminResourceModule.name]);
angular.module('adminModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('admin', {
      url:'/admin',
      template,
      controller: 'AdminCtrl',
      title: 'Admin Area',
      resolve: {
        stats: ['$q', '$location', 'securityAuthorization', 'adminResource', function($q, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(adminResource.getStats, function(reason){
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
export const adminModule = angular.module('adminModule').controller('AdminCtrl', ['$scope', '$log', 'stats','$state',
  function($scope, $log, stats,$state){
    $scope.user = {
      users: stats['User'],
      accounts: stats['Account'],
      admins: stats['Admin'],
      groups: stats['AdminGroup'],
      hairdressers: stats['Hairdresser']
    };
    $scope.pivoted = {
      categories: stats['Category'],
      statuses: stats['Status']
    };

    $scope.goToState = function(state){      
      const effectiveState = state.toString().toUpperCase() || '';      
        switch(effectiveState){
          case 'USERS':
            $state.go("adminusers");
            break;
          case 'ACCOUNTS':
            $state.go("adminaccounts");
          break;
          case 'ADMINS':
            $state.go("adminadministrators");
          break;
          case 'GROUPS':
            $state.go("adminadmingroups");
          break;
          case 'CATEGORIES':
            $state.go("admincategories")
          break;
          case 'STATUSES':
            $state.go("adminstatuses")
          break;
          case 'HAIRDRESSERS':
            $state.go("adminhairdressers");
          break;
          default:
            throw new Error(' the state '+effectiveState+' is not handled by this function ');
          break;
        }
      
    };
  }]);