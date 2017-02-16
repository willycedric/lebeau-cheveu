import uiRouter from 'angular-ui-router';
import {config} from './../../config';
import {securityServiceModule} from './../common/security/security';
import {servicesUtilityModule} from './../common/services/utility';
import template from './signup.tpl.html';
angular.module('signupModule', [
 config.name, 
 servicesUtilityModule.name,
  securityServiceModule.name
   ]);
/*angular.module('signupModule').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/signup', {
      templateUrl: 'signup/signup.tpl.html',
      controller: 'SignupCtrl',
      title: 'Sign Up',
      resolve: {
        UnauthenticatedUser: ['$q', '$location', 'securityAuthorization', function($q, $location, securityAuthorization){
          var promise = securityAuthorization.requireUnauthenticatedUser()
            .catch(function(){
              // user is authenticated, redirect
              $location.path('/account');
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);*/
angular.module('signupModule',[uiRouter]).config(($stateProvider)=>{
    $stateProvider.state('signup',{
      url:'/signup',
      template,
      controller:'SignupCtrl',
      title: 'Inscription',
      resolve:{
        UnauthenticatedUser: ['$q', '$location', 'securityAuthorization', function($q, $location, securityAuthorization){
          var promise = securityAuthorization.requireUnauthenticatedUser()
            .catch(function(){
              // user is authenticated, redirect
              $location.path('/account');
              return $q.reject();
            });
          return promise;
        }]
      }

    });
});
export const signupModule = angular.module('signupModule').controller('SignupCtrl', [ '$scope', '$location', '$log', 'utility', 'security', 'SOCIAL',
  function($scope, $location, $log, utility, security, SOCIAL){
    // local variable
    var signupSuccess = function(data){
      if(data.success){
        //account/user created, redirect...
        var url = data.defaultReturnUrl || '/';
        return $location.path(url);
      }else{
        //error due to server side validation
        $scope.errfor = data.errfor;
        angular.forEach(data.errfor, function(err, field){
          $scope.signupForm[field].$setValidity('server', false);
        });
      }
    };
    var signupError = function(){
      $scope.alerts.push({
        type: 'danger',
        msg: 'Error creating account, Please try again'
      });
    };
    // model def
    $scope.user = {};
    $scope.alerts = [];
    $scope.errfor = {};
    $scope.social = angular.equals({}, SOCIAL)? null: SOCIAL;

    // method def
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.canSave = utility.canSave;
    $scope.closeAlert = function(ind){
      $scope.alerts.splice(ind, 1);
    };
    $scope.submit = function(){
      security.signup($scope.user).then(signupSuccess, signupError);
    };
  }]);