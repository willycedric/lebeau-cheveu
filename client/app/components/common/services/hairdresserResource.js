import {securityServiceModule} from './../security/security';

export const servicesHairdresserResourceModule = angular.module('servicesHairdresserResourceModule', [securityServiceModule.name]).factory('hairdresserResource', ['$http', '$q', '$log', 'security','API', function ($http, $q, $log, security,API) {
  // local variable
 const baseUrl =`${API.dev.homeUrl}`+'/api';
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

  resource.upload = function(data){
      return  $http.post(baseUrl+'/hairdresser/upload',data).then(processResponse,processError);
  };

  resource.findHaircutCatalog = function(id){
    return $http.get(baseUrl+'/hairdresser/catalog/'+id.toString()).then(processResponse,processError);
  };

  resource.updateGaleryEntry=function(data){
    return $http.put(baseUrl+'/hairdresser/upload/galery',data).then(processResponse,processError);    
  };

  resource.updateHairdresserDescription=function(data){
    
    return $http.put(baseUrl+'/hairdresser/update/description',data).then(processResponse,processError);    
  };
  resource.findGaleryEntries = function(id){
    return $http.get(baseUrl+'/hairdresser/galery/entries/'+id.toString()).then(processResponse,processError);
  };

  resource.deleteGaleryEntries=function(id, categoryId){
     console.log("entry id", id, " category id ", categoryId);
     return $http.delete(baseUrl+'/hairdresser/galery/entries/'+id.toString()+'/'+categoryId.toString()).then(processResponse,processError);
  }

  resource.getAvailableHaircutCategories = function () {
     return $http.get(baseUrl+'/hairdresser/haircut/categories/').then(processResponse,processError);
  }

  resource.findHaircutCategoryById = function (id) {
     var url = '/hairdresser/haircut/categories/'+id.toString();
     return $http.get(baseUrl+url).then(processResponse,processError);
  }

  resource.getAvailableHaircutStyles = function () {
     return $http.get(baseUrl+'/hairdresser/haircut/styles').then(processResponse,processError);
  } 
  
  return resource;
}]);


