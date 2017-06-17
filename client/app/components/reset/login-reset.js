import uiRouter from 'angular-ui-router';
import{securityServiceModule} from './../common/security/security';
import {servicesUtilityModule} from './../common/services/utility';
import template from './loginreset.tpl.html';
import './login-reset.scss';
angular.module('login.reset', [securityServiceModule.name, servicesUtilityModule.name, uiRouter]);
angular.module('login.reset').config(($stateProvider) => {
    $stateProvider
    .state('loginreset', {
        url:'/login/reset',
      template,
      controller: 'LoginResetCtrl'     
    }),
    $stateProvider.state('loginresetdetail', {
        url:'/login/reset/:username/:token',
      template,
      controller: 'LoginResetCtrl'
    });
});
export const reset = angular.module('login.reset').controller('LoginResetCtrl', [ '$scope', '$location', '$stateParams', '$log', 'security', 'utility',
  function($scope, $location, $stateParams, $log, security, utility){
    // local variable
    var warningAlert = {
      type: 'warning',
      msg:  'Vous n\'avez pas de requête de réinitialisation valide.'
    };
    var successAlert = {
      type: 'info',
      msg:  'Votre mot de passe a été réinitialisé. Veuillez vous connecter pour confirmer.'
    };
    var resetSuccess = function(data){
      $scope.resetForm.$setPristine();
      $scope.user = {};
      if(data.success){
        $scope.success = true;
        $scope.alerts.push(successAlert);
      }else{
        angular.forEach(data.errors, function(err, index){
          $scope.alerts.push({
            type: 'danger',
            msg: err
          });
        });
      }
    };
    var resetError = function(){
      $scope.alerts.push({
        type: 'danger',
        msg: 'Erreur lors de la réinitialisation de votre mot de passe, réessayez'
      });
    };
    // model def
    $scope.user = {};
    $scope.alerts = [];
    $scope.username = $stateParams.username;
    $scope.id = $stateParams.token;
    $scope.success = false;

    //initial behavior
    if(!($scope.username && $scope.id)){
      $scope.alerts.push(warningAlert);
    }

    // method def
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.canSave = utility.canSave;
    $scope.closeAlert = function(ind){
      $scope.alerts.splice(ind, 1);
    };
    $scope.submit = function(){
      security.loginReset($scope.id, $scope.username, $scope.user).then(resetSuccess, resetError);
    };
  }]);
