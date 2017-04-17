

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-hairdressers.tpl.html';
import './admin-hairdresser.scss';
import moment from 'moment';

angular.module('adminHairdressersIndexModule', [uiRouter,
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
]);
angular.module('adminHairdressersIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminhairdressers', {
      url:'/admin/hairdressers',
      template,
      controller: 'HairdressersIndexCtrl',
      title: 'Manage Hairdressers',
      resolve: {
        hairdressers: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /hairdresser
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findHairdressers($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/hairdresser': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/hairdresser';
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
export const adminHairdressersIndexModule = angular.module('adminHairdressersIndexModule').controller('HairdressersIndexCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource', 'ModalFactory','hairdressers',
  function($scope, $route, $location, $log, utility, adminResource,ModalFactory, data){
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
      $scope.hairdressers = results.data;
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
    var fetchHairdressers = function(){
      adminResource.findHairdressers($scope.filters).then(function(data){
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
      fetchHairdressers();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchHairdressers();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchHairdressers();
    };
    $scope.addHairdresser = function(fullname){
      adminResource.addHairdresser($scope.fullname).then(function(data){
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

    $scope.lauchAddHairdresserForm = function(){
      ModalFactory.trigger(this, "newHairdresser.html","custom",function($uibModalInstance,topController){

        this.addHairdresser = function(fullname){
          topController.fullname = fullname || '';
          topController.addHairdresser();
          $uibModalInstance.close('OK');
        };

        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        this.canSave = function(ngFormCtrl){
          console.log('inside this function');
            return  ngFormCtrl.$dirty && ngFormCtrl.$valid;
        }
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
    $scope.isActives =[{label: "either", value: ""}, {label: "yes", value: "yes"}, {label: "no", value: "no"}];
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