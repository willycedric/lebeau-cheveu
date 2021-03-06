
import {securityServiceModule} from './security';
import {config} from './../../../config';
export const securityAuthorizationModule = angular.module('securityAuthorizationModule', [securityServiceModule.name, config.name])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
.provider('securityAuthorization', {

  requireAdminUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAdminUser();
  }],
  requireAccountUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAccountUser();
  }],
  requireHaidresserUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireHaidresserUser();
  }],

  requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAuthenticatedUser();
  }],

  requireUnauthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireUnauthenticatedUser();
  }],

  requireVerifiedUser: [ 'securityAuthorization', function(securityAuthorization){
    return securityAuthorization.requireVerifiedUser();
  }],
   requireVerifiedHairdresser: [ 'securityAuthorization', function(securityAuthorization){
    return securityAuthorization.requireVerifiedHairdresser();
  }],

  requireUnverifiedUser: [ 'securityAuthorization', function(securityAuthorization){
    return securityAuthorization.requireUnverifiedUser();
  }],
  requireUnverifiedAndUnauthenticatedUser: [ 'securityAuthorization', function(securityAuthorization){
    return securityAuthorization.requireUnverifiedAndUnauthenticatedUser();
  }],

  $get: ['$log', '$q', '$location', 'security', 'securityRetryQueue', 'REQUIRE_ACCOUNT_VERIFICATION', function($log, $q, $location, security, queue, requireAccountVerification) {
    var service = {

      // Require that there is an authenticated user
      // (use this in a route resolve to prevent non-authenticated users from entering that route)
      requireAuthenticatedUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAuthenticated() ) {
            return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
          }
        });
        return promise;
      },

      requireUnauthenticatedUser: function(){
        var promise = security.requestCurrentUser().then(function(userInfo){
          if( security.isAuthenticated() ){
            return $q.reject('authenticated-client');
          }
        });
        return promise;
      },

      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireAdminUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAuthenticated() ) {
            return queue.pushRetryFn('unauthenticated-client', service.requireAdminUser);
          }else if( !security.isAdmin() ){
            return $q.reject('unauthorized-client');
          }
        });
        return promise;
      },
      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireAccountUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAuthenticated() ) {
            return queue.pushRetryFn('unauthenticated-client', service.requireAccountUser);
          }else if( !security.isAccount() ){
            return $q.reject('unauthorized-client');
          }
        });
        return promise;
      },
      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireHairdresserUser: function() {        
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAuthenticated() ) {
            return queue.pushRetryFn('unauthenticated-client', service.requireHairdresserUser);
          }else if(!security.isHairdresser()){
            return $q.reject('unauthorized-client');
          }
        });
        return promise;
      },

      requireCurrentUser : function(){
        return security.requestCurrentUser();
      },

      requireVerifiedUser: function(){        
        var promise = security.requestCurrentUser().then(function(userInfo){
          if( !security.isAuthenticated() ){
            return queue.pushRetryFn('unauthenticated-client', service.requireVerifiedUser);
          }          
          if(requireAccountVerification && userInfo && !userInfo.isVerified){
            return $q.reject('unverified-client');
          }
        });
        return promise;
      },
      requireVerifiedHairdresser: function(){               
        var promise = security.requestCurrentUser().then(function(userInfo){
          if( !security.isAuthenticated() ){
            return queue.pushRetryFn('unauthenticated-client', service.requireVerifiedUser);
          }          
          if(requireAccountVerification && userInfo && !userInfo.isVerified){
            return $q.reject('unverified-client');
          }
        });
        return promise;
      },

      requireUnverifiedUser: function(){
        //debugger;
        var promise = security.requestCurrentUser().then(function(userInfo){
          //console.log('require account verification ',requireAccountVerification, 'userIinfo ', JSON.stringify(userInfo, null, 6),'isAUthenticated ',security.isAuthenticated());
          if( !security.isAuthenticated() ){            
            return queue.pushRetryFn('unauthenticated-client', service.requireUnverifiedUser);
          }
          if(requireAccountVerification && userInfo && userInfo.isVerified){            
            return $q.reject('verified-client');
          }
        });
        return promise;
      },
      requireUnverifiedAndUnauthenticatedUser: function(){        
        var promise = security.requestCurrentUser().then(function(userInfo){                 
          if(requireAccountVerification && userInfo && userInfo.isVerified){            
            return $q.reject('verified-client');
          }
        });
        return promise;
      },
      requireUnPrivilegedUser:function(){
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      }

    };

    return service;
  }]
});