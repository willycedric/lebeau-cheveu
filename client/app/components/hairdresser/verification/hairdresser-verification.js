import {servicesUtilityModule} from './../../common/services/utility';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import uiRouter from 'angular-ui-router';
import template from './hairdresser-verification.tpl.html';
angular.module('hairdresserVerificationModule',
 [ 
  servicesUtilityModule.name,
  servicesHairdresserResourceModule.name,
  uiRouter
  ]);
angular.module('hairdresserVerificationModule')
.config(($stateProvider) => {
  $stateProvider
    .state('hairdresserverification', {
      url:'/hairdresser/verification',
      template,
      controller: 'HairdresserVerificationCtrl',      
      resolve: {
        upsertVerificationToken: ['$q', '$location', 'hairdresserResource', 'securityAuthorization', function($q, $location, restResource, securityAuthorization){
          //lazy upsert verification only for un-verified user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireHairdresserUser()
            .then(restResource.upsertVerification, function(reason){
              //rejected either user is verified already or isn't authenticated
              redirectUrl = reason === 'verified-client'? '/account': '/login';
              return $q.reject();
            })
            .then(function(data){
              if(!data.success){
                return $q.reject();
              }
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise; //promise resolved if data.success == true
        }]
      }
    }),
    $stateProvider
    .state('hairdresserverificationtoken', {
      url:'/hairdresser/verification/:token',
       template,
      controller: 'HairdresserVerificationCtrl',
      resolve: {
        verify: ['$q', '$location', '$stateParams', 'hairdresserResource', 'securityAuthorization', function($q, $location, $route, hairdresserResource, securityAuthorization){
          //attemp to verify account only for un-verified user
          var redirectUrl;
          var promise = securityAuthorization.requireUnverifiedUser()
            .then(function(){
              return restResource.verifyAccount($stateParams.token);
            }, function(){
              redirectUrl = '/account';
              return $q.reject();
            })
            .then(function(data){
              if(data.success) {
                redirectUrl = '/account';
              }
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/hairdresser/verification';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise; //promise never resolves, will always redirect
        }]
      }
    })
});
export const hairdresserVerificationModule = angular.module('hairdresserVerificationModule').controller('HairdresserVerificationCtrl', [ '$scope', '$location', '$log', 'hairdresserResource', 'security', 'utility',
  function($scope, $location, $log, restResource, security, utility){
    //model def
    $scope.formVisible = false;
    $scope.email = security.currentUser.email;
    $scope.errfor = {}; //for email server-side validation
    $scope.alerts = [];

    // method def
    $scope.showForm = function(){
      $scope.formVisible = true;
    };
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.closeAlert = function(ind){
      $scope.alerts.splice(ind, 1);
    };
    $scope.submit = function(){
      $scope.alerts = [];
      restResource.resendVerification($scope.email).then(function (data) {
        if (data.success) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Verification email successfully re-sent.'
          });
          $scope.formVisible = false;
          $scope.verificationForm.$setPristine();
        } else {
          //error due to server side validation
          $scope.errfor = data.errfor;
          angular.forEach(data.errfor, function (err, field) {
            $scope.verificationForm[field].$setValidity('server', false);
          });
        }
      }, function (x) {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Error sending verification email: ' + x
        });
      });
    };
  }
]);
