import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import {loginDirective} from './login.directive';


export const login = angular.module('login', [uiRouter,ngAnimate])
  .config(($stateProvider) => {
    $stateProvider.state('login', {
      url: '/login',
      onEnter:function($uibModal,$state){
        var $ctrl = this;
        $ctrl.items = ['item1', 'item2', 'item3'];
        $ctrl.animationsEnabled = true;
        var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        template: '<login></login>',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          items: function () {
            return $ctrl.items;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $ctrl.selected = selectedItem;
        $state.go('^');
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
        $state.go('^');
      });

      }//end On enter
    })
  })
  .directive('login',loginDirective)
  .directive('emailValidator', ()=>{ //mail validator directive
  	return{
  		require:'ngModel',
  		restrict:'A',
  		link:function(scope,element,attrs,ngModel){
  			//var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re=/^[a-z]$/;
  			ngModel.$validators.email = (value)=>{
  				return !value || re.test(value);
  			};
  		}
  	};
  })
  .directive('passwordValidator', ($rootScope)=>{ //password validator directive
  	return{
  		require:'ngModel',
  		restrict:'A',
  		link:function(scope,element, attrs, ngModel){
				 /* (/^(?=.*\d)         //should contain at least one digit
				(?=.*[a-z])             //should contain at least one lower case
				(?=.*[A-Z])             //should contain at least one upper case
				[a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters (rule implemented)
				$/)*/
  				var re= /^[0-9a-zA-Z]{8,}$/;
  				ngModel.$validators.password = (value)=>{
              $rootScope.currentPassword=value;
  						return value&&re.test(value);
  				};
  		}
  	};
  })
  .directive('usernameValidator', ($q,Auth)=>{//unique username validator on registration
  		return {
  			require:'ngModel',
  			restrict:'A',
  			link:function(scope,element,attrs,ngModel){
  				ngModel.$asyncValidators.uniqueusername = (value)=>{
  						if(ngModel.$isEmpty(value)){
  							return $q.when();
  						}
  						var deferred = $q.defer();
  						Auth.isUsernameAvailable(value)
  						.then(function isUserNameAvailabcleValidatorSuccess (response){
  							deferred.resolve();
  						},function isUserNameAvailableValidatorFailure(err){
  							deferred.reject(err);
  						});
  						return deferred.promise;
  				};
  			}
  		};
  })
.directive('usernameExistence', ($q, Auth)=>{ //existence of the username on login
    return {
      require:'ngModel',
      restrict:'A',
      link:function(scope,element,attrs,ngModel){
           ngModel.$asyncValidators.existusername = (value)=>{
            if(ngModel.$isEmpty(value)){
              return $q.when();
            }
            var deferred = $q.defer();
            Auth.isUsernameExist(value)
            .then(function isUserNameAvailabcleValidatorSuccess (response){
              deferred.resolve();
            },function isUserNameAvailableValidatorFailure(err){
              deferred.reject(err);
            });
            return deferred.promise;           
          };
      }
    }
})
.directive('passwordConfirmation', ($rootScope)=>{
  return{
    require:'ngModel',
    restrict:'A',
    link:function(scope,element,attrs,ngModel){        
        ngModel.$validators.passwordconfirmation = (value)=>{
          return value === $rootScope.currentPassword;
        }
    }
  };
});

