import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import {loginDirective} from './login.directive';
/*import {authFactory} from './../../shared/authFactory';*/

export const login = angular.module('login', [uiRouter,ngAnimate])
  .config(($stateProvider) => {
    $stateProvider.state('login', {
      url: '/login',
      template: '<login></login>'
    })
  })
  .directive('login',loginDirective)
  .directive('emailValidator', ()=>{ //mail validator directive
  	return{
  		require:'ngModel',
  		restrict:'A',
  		link:function(scope,element,attrs,ngModel){
  			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  			ngModel.$validators.email = (value)=>{
  				return !value || re.test(value);
  			};
  		}
  	};
  })
  .directive('passwordValidator', ()=>{ //password validator directive
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
  						return value&&re.test(value);
  				};
  		}
  	};
  })
  .directive('usernameValidator', ($q,Auth)=>{//unique username validator
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
  });

