//import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import {securityAuthorizationModule} from './../common/security/authorization';
angular.module('accountIndexModule', [uiRouter,securityAuthorizationModule.name]);
angular.module('accountIndexModule')
  .config(($stateProvider,securityAuthorizationProvider)=>{
    $stateProvider.state('account',{
      url:'/account',
      templateUrl:'account.tpl.html',
      controller:'AccountCtrl',
      title:'Account Area',
      resolve: {
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
  });
export const accountIndexModule = angular.module('accountIndexModule').controller('AccountCtrl', [ '$scope' ,
  function($scope){
    $scope.dayOfYear = moment().format('DDD');
    $scope.dayOfMonth = moment().format('D');
    $scope.weekOfYear = moment().format('w');
    $scope.dayOfWeek = moment().format('d');
    $scope.weekYear = moment().format('gg');
    $scope.hourOfDay = moment().format('H');
  }]);
