
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-account.tpl.html';
import moment from 'moment';
import './admin-account.scss';
angular.module('adminAccountDetailModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
  ]);
angular.module('adminAccountDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminaccountdetails', {
      url:'/admin/accounts/:id',
      template,
      controller: 'AccountsDetailCtrl',
      title: 'Accounts / Details',
      resolve: {
        account: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $stateParams.id || '';
              if(id){
                return adminResource.findAccount(id);
              }else{
                redirectUrl = '/admin/accounts';
                return $q.reject();
              }
            }, function(reason){
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
export const adminAccountDetailModule =  angular.module('adminAccountDetailModule').controller('AccountsDetailCtrl', ['$scope', '$route', '$location', 'utility', 'adminResource', 'account',
  function($scope, $route, $location, utility, adminResource, data) {
    // local vars
    //// local var
    var getAvailableStatus = function () {
      adminResource.getStatus()
      .then((data)=>{
         $scope.statuses = data.data;
      });
    };
    var deserializeData = function(data){
      getAvailableStatus();
      deserializeAccount(data.record);
    };
    var deserializeAccount = function(account){
      $scope.account = account;
      $scope.selectedStatus = {
        "_id": account.status.id,
        "name": account.status.name
      };
    };
    var closeAlert = function(alert, ind){
      alert.splice(ind, 1);
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

    // $scope vars
    $scope.contactAlerts = [];
    $scope.loginAlerts = [];
    $scope.deleteAlerts = [];
    $scope.statusAlerts = [];
    $scope.noteAlerts = [];
    $scope.canSave = utility.canSave;
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.closeContactAlert = function(ind){
      closeAlert($scope.contactAlerts, ind);
    };
    $scope.closeLoginAlert = function(ind){
      closeAlert($scope.loginAlerts, ind);
    };
    $scope.closeDeleteAlert = function(ind){
      closeAlert($scope.deleteAlerts, ind);
    };
    $scope.closeStatusAlert = function(ind){
      closeAlert($scope.statusAlerts, ind);
    };
    $scope.closeNoteAlert = function(ind){
      closeAlert($scope.noteAlerts, ind);
    };
    $scope.formatTime = function(timestamp, replace){
      var res = moment(timestamp).from();
      return replace? res.replace('ago', replace): res;
    };
    $scope.updateAccount = function(){
      var data = {
        first:   $scope.account.name.first,
        middle:  $scope.account.name.middle,
        last:    $scope.account.name.last,
        company: $scope.account.company,
        phone:   $scope.account.phone,
        zip:     $scope.account.zip
      };
      $scope.contactAlerts = [];
      adminResource.updateAccount($scope.account._id, data).then(function(result){
        if(result.success){
          deserializeAccount(result.account);
          $scope.contactAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.contactAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function(x){
        $scope.contactAlerts.push({ type: 'danger', msg: 'Error updating account: ' + x });
      });
    };
    $scope.linkUser = function () {
      $scope.loginAlerts = [];
      var newUsername = $scope.account.newUsername;
      $scope.account.newUsername = '';
      adminResource.linkAccountUser($scope.account._id, { newUsername: newUsername }).then(function (result) {
        $scope.loginForm.$setPristine();
        if (result.success) {
          deserializeAccount(result.account);
        } else {
          angular.forEach(result.errors, function (err, index) {
            $scope.loginAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function (x) {
        $scope.loginAlerts.push({ type: 'danger', msg: 'Error linking user: ' + x });
      });
    };
    $scope.unlinkUser = function () {
      $scope.loginAlerts = [];
      if (confirm('Are you sure?')) {
        adminResource.unlinkAccountUser($scope.account._id).then(function (result) {
          if (result.success) {
            deserializeAccount(result.account);
          } else {
            angular.forEach(result.errors, function (err, index) {
              $scope.loginAlerts.push({type: 'danger', msg: err});
            });
          }
        }, function (x) {
          $scope.loginAlerts.push({ type: 'danger', msg: 'Error unlinking user: ' + x });
        });
      }
    };
    $scope.deleteAccount = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteAccount($scope.account._id).then(function(result){
          if(result.success){
            // redirect to admin users index page
            $location.path('/admin/accounts');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting account: ' + x });
        });
      }
    };
    $scope.changeStatus = function(){
      $scope.statusAlerts = [];
      if($scope.selectedStatus && $scope.selectedStatus._id){
        if($scope.selectedStatus._id === $scope.account.status.id){
          // status selected is the current status
          $scope.statusAlerts.push({ type: 'danger', msg: 'That is the current status.'});
        }else{
          // update status
          var data = {
            id: $scope.selectedStatus._id,
            name: $scope.selectedStatus.name
          };
          adminResource.newAccountStatus($scope.account._id, data).then(function(result){
            if(result.success){
              deserializeAccount(result.account);
            }else{
              //error due to server side validation
              angular.forEach(result.errors, function(err, index){
                $scope.statusAlerts.push({ type: 'danger', msg: err});
              });
            }
          }, function(x){
            $scope.statusAlerts.push({ type: 'danger', msg: 'Error adding new status: ' + x});
          });
        }
      }else{ //no status is selected
        $scope.statusAlerts.push({ type: 'danger', msg: 'Please choose a status.'});
      }
    };
    $scope.addNote = function(){
      $scope.noteAlerts = [];
      if($scope.newNote){
        var data = { data: $scope.newNote };
        $scope.newNote = undefined;  //reset $scope.newNote
        adminResource.newAccountNote($scope.account._id, data).then(function(result){
          if(result.success){
            deserializeAccount(result.account);
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.noteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.noteAlerts.push({ type: 'danger', msg: 'Error adding new note: ' + x});
        });
      }else{
        // new note is empty
        $scope.noteAlerts.push({ type: 'danger', msg: 'Please enter some notes.' });
      }
    };
    //initialize
    deserializeData(data);
  }
]);