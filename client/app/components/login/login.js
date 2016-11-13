import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import {loginDirective} from './login.directive';
import {ModalInstanceCtrl} from './modalCtrl';
import './login.scss';
import {LoginController as controller} from './login.controller';
import template from './login.html';


export const login = angular.module('login', [uiRouter,ngAnimate])
  .config(($stateProvider) => {
    $stateProvider.state('login', {
      url: '/login',
      template:'<login></login>'
    })
  })
  .config(($logProvider)=> {
    $logProvider.debugEnabled(true);
  })
  .directive('login',loginDirective)
  .directive('emailValidator', ()=>{ //mail validator directive
  	return{
  		require:'ngModel',
  		restrict:'A',
  		link:function(scope,element,attrs,ngModel){
  			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       /* var re=/^[a-z]$/;*/
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
  .directive('usernameValidator', ($q,Auth,API,$log)=>{//unique username validator on registration
  		return {
  			require:'ngModel',
  			restrict:'A',
  			link:function(scope,element,attrs,ngModel){          
              ngModel.$asyncValidators.uniqueusername = (value)=>{
                if(ngModel.$isEmpty(value)){
                  return $q.when();
                }
               
                attrs.$observe("hairdresser", function(name){
                 return  scope.name =name;
                });
                //console.log(scope.name);
                var deferred = $q.defer();
                Auth.isUsernameAvailable(API.dev.hairdresserRoute+'/isUsernameAvailable',value)
                .then(function isUserNameAvailableValidatorSuccess (response){
                  deferred.resolve();
                },function isUserNameAvailableValidatorFailure(err){
                  deferred.reject(err);
                });
                return deferred.promise;
            }
  				
  			}
  		};
  })
.directive('usernameExistence', ($q, Auth,API,$log)=>{ //existence of the username on login
    return {
      require:'ngModel',
      restrict:'A',
      link:function(scope,element,attrs,ngModel){
          if(attrs.actor ==="customer"){
            ngModel.$asyncValidators.existusername = (value)=>{
            if(ngModel.$isEmpty(value)){
              return $q.when();
            }
            var deferred = $q.defer();
            Auth.isUsernameExist(`${API.dev.customerRoute}`+'/isAvailable',value)
            .then(function isUserNameAvailabcleValidatorSuccess (response){
              deferred.resolve();
            },function isUserNameAvailableValidatorFailure(err){
              deferred.reject(err);
            });
            return deferred.promise;           
          };
        }else if(attrs.actor=="hairdresser"){
          ngModel.$asyncValidators.existusername = (value)=>{
            if(ngModel.$isEmpty(value)){
              return $q.when();
            }
            var deferred = $q.defer();
            Auth.isUsernameExist(`${API.dev.hairdresserRoute}`+'/isAvailable',value)
            .then(function isUserNameAvailabcleValidatorSuccess (response){
              deferred.resolve();
            },function isUserNameAvailableValidatorFailure(err){
              deferred.reject(err);
            });
            return deferred.promise;           
          };
        }else{
           $log.error("existence username validator no actor defined")
        }
           
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
