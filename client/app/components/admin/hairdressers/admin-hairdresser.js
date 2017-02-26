
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-hairdresser.tpl.html';
import moment from 'moment';
angular.module('adminHairdresserDetailModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
  ]);
angular.module('adminHairdresserDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminhairdresserdetails', {
      url:'/admin/hairdressers/:id',
      template,
      controller: 'HairdressersDetailCtrl',
      title: 'Hairdressers / Details',
      resolve: {
        hairdresser: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /hairdresser
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $stateParams.id || '';
              if(id){
                return adminResource.findHairdresser(id);
              }else{
                redirectUrl = '/admin/hairdressers';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/hairdresser': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/hairdresser';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const adminHairdresserDetailModule =  angular.module('adminHairdresserDetailModule').controller('HairdressersDetailCtrl', ['$scope', '$route', '$location', 'utility', 'adminResource', 'hairdresser',
  function($scope, $route, $location, utility, adminResource, hairdresser) {
    // local vars
    var getAvailableStatus = function(){
      adminResource.getStatus()
      .then((data)=>{
        console.log(data.data);
        $scope.statuses=data.data;
      });
    };

    var deserializeData = function(data){
      //$scope.statuses = data.statuses;
      getAvailableStatus();
      deserializeHairdresser(data.record);
    };
    var deserializeHairdresser = function(hairdresser){
      $scope.hairdresser = hairdresser;
      $scope.selectedStatus = {
        "_id": hairdresser.status.id,
        "name": hairdresser.status.name
      };
    };
    var closeAlert = function(alert, ind){
      alert.splice(ind, 1);
    };

    $scope.redirectToHairdresserDetails = function(id){
      var redirectUrl ;
      if(id){
        redirectUrl = '/admin/hairdressers/'+id.toString();
      }else{
        redirectUrl='/admin/hairdressers/';
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
    $scope.updateHairdresser = function(){
      var data = {
        first:   $scope.hairdresser.name.first,
        middle:  $scope.hairdresser.name.middle,
        last:    $scope.hairdresser.name.last,
        company: $scope.hairdresser.company,
        phone:   $scope.hairdresser.phone,
        zip:     $scope.hairdresser.zip
      };
      $scope.contactAlerts = [];
      adminResource.updateHairdresser($scope.hairdresser._id, data).then(function(result){
        if(result.success){
          deserializeHairdresser(result.hairdresser);
          $scope.contactAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.contactAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function(x){
        $scope.contactAlerts.push({ type: 'danger', msg: 'Error updating hairdresser: ' + x });
      });
    };
    $scope.linkUser = function () {
      $scope.loginAlerts = [];
      var newUsername = $scope.hairdresser.newUsername;
      $scope.hairdresser.newUsername = '';
      adminResource.linkUser($scope.hairdresser._id, { newUsername: newUsername }).then(function (result) {
        $scope.loginForm.$setPristine();
        if (result.success) {
          deserializeHairdresser(result.hairdresser);
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
        adminResource.unlinkUser($scope.hairdresser._id).then(function (result) {
          if (result.success) {
            deserializeHairdresser(result.hairdresser);
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
    $scope.deleteHairdresser = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteHairdresser($scope.hairdresser._id).then(function(result){
          if(result.success){
            // redirect to admin users index page
            $location.path('/admin/hairdressers');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting hairdresser: ' + x });
        });
      }
    };
    $scope.changeStatus = function(){
      $scope.statusAlerts = [];
      if($scope.selectedStatus && $scope.selectedStatus._id){
        if($scope.selectedStatus._id === $scope.hairdresser.status.id){
          // status selected is the current status
          $scope.statusAlerts.push({ type: 'danger', msg: 'That is the current status.'});
        }else{
          // update status
          var data = {
            id: $scope.selectedStatus._id,
            name: $scope.selectedStatus.name
          };
          adminResource.newHairdresserStatus($scope.hairdresser._id, data).then(function(result){
            if(result.success){
              deserializeHairdresser(result.hairdresser);
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
        adminResource.newHairdresserNote($scope.hairdresser._id, data).then(function(result){
          if(result.success){
            deserializeHairdresser(result.hairdresser);
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
    deserializeData(hairdresser);
  }
]);