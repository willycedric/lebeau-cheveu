

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-haircut-styles.tpl.html';
import './admin-haircut-style.scss';
angular.module('adminhaircutstyleIndexModule', [uiRouter,
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
]);
angular.module('adminhaircutstyleIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminhaircutstyle', {
      url:'/admin/haircut/styles',
      template,
      controller: 'HairtCutStyleIndexCtrl',
      title: 'Manage haircut style',
      resolve: {
        styles: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /gallery
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.getHaircutStylesEntry($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/gallery': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/gallery';
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
export const adminhaircutstyleIndexModule = angular.module('adminhaircutstyleIndexModule').controller('HairtCutStyleIndexCtrl', ['$scope', '$route', '$location', '$log', 'adminResource', 'styles','ModalFactory','$window',
  function($scope, $route, $location, $log, adminResource, data, ModalFactory, $window){ 

    var deserializeData = function(data){      
       $scope.haircuts = data.results.data;  
       console.log("entries ",JSON.stringify($scope.haircuts, null, data));
     
    };    
    
    $scope.redirectToHaircutStyleDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl='/admin/haircut/styles/'+id.toString();
      }else{
        redirectUrl='/admin/haircut/styles';
      }
      $location.path(redirectUrl);
    };  

    // $scope methods  
    var addHaircutStyle = function(category){
      adminResource.createHaircutStylesEntry(category)
      .then(function(data){
           if(data.success){
              $window.location.reload();
            }else if (data.errors && data.errors.length > 0){
              alert(data.errors[0]);
            }else {
              alert('unknown error.');
            }
      }, function(err){
          $scope.add = {};
         $log.error(err);
      });     
    };

   

     
      
    $scope.LaunchAddHaircutStyleForm = () => {
      ModalFactory.trigger(this, "newHaircutStyle.html","custom",function($uibModalInstance,topController){
        this.addHaircutStyle = function(name,state){
          const controledName = name || '';
          const controledDescription = state ||'';
          addHaircutStyle({name:controledName, state:controledDescription});
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

    //initialize $scope variables
    deserializeData(data);

  }
]);