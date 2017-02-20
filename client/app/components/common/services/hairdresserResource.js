import {securityServiceModule} from './../security/security';

export const servicesHairdresserResourceModule = angular.module('servicesHairdresserResourceModule', [securityServiceModule.name]).factory('hairdresserResource', ['$http', '$q', '$log', 'security', function ($http, $q, $log, security) {
  // local variable
 const baseUrl = 'http://localhost:3500/api';
  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
  resource.sendMessage = function(data){
    return $http.post(baseUrl + '/sendMessage', data).then(processResponse, processError);
  };

  resource.getSettings = function(){
    return $http.get(baseUrl + '/hairdresser/settings').then(processResponse, processError);
  };

  resource.getBookings= function(){
    return $http.get(baseUrl + '/hairdresser/bookings').then(processResponse, processError);
  };

  resource.getMessages = function(){
    return $http.get(baseUrl + '/hairdresser/messages').then(processResponse, processError);
  };

  resource.getPictures = function(){
    return $http.get(baseUrl + '/hairdresser/pictures').then(processResponse, processError);
  };

  resource.setAccountDetails = function(data){
    return $http.put(baseUrl + '/hairdresser/settings', data).then(processResponse, processError);
  };
  resource.setIdentity = function(data){
    return $http.put(baseUrl + '/hairdresser/settings/identity', data).then(processResponse, processError);
  };
  resource.setPassword = function(data){
    return $http.put(baseUrl + '/hairdresser/settings/password', data).then(processResponse, processError);
  };

  resource.resendVerification = function(email){
    return $http.post(baseUrl + '/hairdresser/verification', {email: email}).then(processResponse, processError);
  };

  resource.upsertVerification = function(){
    return $http.get(baseUrl + '/hairdresser/verification').then(processResponse, processError);
  };

  resource.verifyAccount = function(token){
    return $http.get(baseUrl + '/hairdresser/verification/' + token)
      .then(processResponse, processError)
      .then(function(data){
        //this saves us another round trip to backend to retrieve the latest currentUser obj
        if(data.success && data.user){
          security.setCurrentUser(data.user);
        }
        return data;
      });
  };
  return resource;
}]);
