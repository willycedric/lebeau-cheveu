import {servicesUtilityModule} from './../../common/services/utility';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import uiRouter from 'angular-ui-router';
import template from './hairdresser-verification.tpl.html';
import "./hairdresser-verification.scss";
import verificationTokenTemplate from './hairdresser-verification-token.tpl.html';

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
          var promise = securityAuthorization.requireUnverifiedUser()
            .then(restResource.upsertVerification, function(reason){
              //rejected either user is verified already or isn't authenticated
              redirectUrl = reason === 'verified-client'? '/hairdresser': '/login';
              console.log("reason ", reason);
              return $q.reject();
            })
            .then(function(data){              
              if(!data.success){
                return $q.reject();
              }
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/hairdresser';
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
       template:verificationTokenTemplate,
      controller: 'HairdresserVerificationCtrlToken',
      resolve: {
        verify: ['$q', '$location', '$stateParams', 'hairdresserResource', 'securityAuthorization', function($q, $location, $stateParams, hairdresserResource, securityAuthorization){
          //attemp to verify account only for un-verified user
          var redirectUrl;
          var promise = securityAuthorization.requireUnverifiedUser()
            .then(function(){              
              //debugger;
              return hairdresserResource.verifyAccount($stateParams.token);
            }, function(){ 
                   debugger;
              redirectUrl = '/hairdresser';
              return $q.reject();
            })
            .then(function(data){              
              if(data.success) {
                redirectUrl = '/hairdresser';
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
 angular.module('hairdresserVerificationModule').controller('HairdresserVerificationCtrl', [ '$scope', '$location', '$log', 'hairdresserResource', 'security', 'utility',
  function($scope, $location, $log, restResource, security, utility){
    //model def
    $scope.formVisible = false;
    $scope.email = security.currentUser.email;
    $scope.errfor = {}; //for email server-side validation
    $scope.alerts = [];
    $scope.displaySpinner = false;
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
            msg: 'L\'émail de vérification a été renvoyé avec succès.'
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
          msg: 'Erreur lors de l\'envoi de l\'émail de vérification:' + x
        });
      });
    };
  }
]);

export const hairdresserVerificationModule = angular.module('hairdresserVerificationModule').controller('HairdresserVerificationCtrlToken', [ '$scope','$log', function($scope, $log){
   $log.log("inside the verification token controller.");
    $scope.displaySpinner = true;    
  }
]);

