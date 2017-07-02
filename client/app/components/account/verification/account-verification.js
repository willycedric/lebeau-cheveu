import {servicesUtilityModule} from './../../common/services/utility';
import {servicesAccountResourceModule} from './../../common/services/accountResource';
import uiRouter from 'angular-ui-router';
import template from './account-verification.tpl.html';
import "./account-verification.scss";
import verificationTokenTemplate from './account-verification-token.tpl.html';

angular.module('accountVerificationModule',
 [ 
  servicesUtilityModule.name,
  servicesAccountResourceModule.name,
  uiRouter
  ]);
angular.module('accountVerificationModule')
.config(($stateProvider) => {
  $stateProvider
    .state('accountverification', {
      url:'/account/verification',
      template,
      controller: 'accountVerificationCtrl',      
      resolve: {
        upsertVerificationToken: ['$q', '$location', 'accountResource', 'securityAuthorization', function($q, $location, restResource, securityAuthorization){
          //lazy upsert verification only for un-verified user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireUnverifiedUser()
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
    .state('accountverificationtoken', {
      url:'/account/verification/:token',
       template:verificationTokenTemplate,
      controller: 'accountVerificationCtrlToken'
    })
});
 angular.module('accountVerificationModule').controller('accountVerificationCtrl', [ '$scope', '$location', '$log', 'accountResource', 'security', 'utility',
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
export const accountVerificationModule = angular.module('accountVerificationModule').controller('accountVerificationCtrlToken', [ '$q', '$location', '$stateParams', 'accountResource', 'securityAuthorization','$scope', '$log','$state', function($q, $location, $stateParams, accountResource, securityAuthorization, $scope, $log, $state){      
      $scope.displaySpinner = true;   
      $scope.displayVerificationComplete = false;
      $scope.displayVerificationError=false;
      $scope.displayVerificationInComplete=false;
      var init = function(){
        accountResource.verifyAccount($stateParams.token)
        .then(function verificationSuccess (data){
          if(data.success){
            $scope.displaySpinner =false;
            $scope.displayVerificationComplete=true;
           //$state.go('home');
          }else{
            $scope.displaySpinner =false;
            $scope.displayVerificationInComplete=true;
            console.log('verification incomplete');
            //$state.go('home');
          }
        }, function verificationError(err){
          console.error('error during token verification ', err.toString());
          $scope.displaySpinner =false;
          $scope.displayVerificationError=true;
          $state.go('home');
        })
      }
      init();
  }
]);

