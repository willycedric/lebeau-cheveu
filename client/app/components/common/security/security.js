import uiBootstrap from 'angular-ui-bootstrap';
import {securityRetryQueueModule} from './retryQueue';
import {securityLoginModule} from './login/login';
import template from './login/form.tpl.html';
// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
export const securityServiceModule = angular.module('securityServiceModule', [
  securityRetryQueueModule.name,    // Keeps track of failed requests that need to be retried once the user logs in
  securityLoginModule.name,         // Contains the login form template and controller
 uiBootstrap     // Used to display the login form as a modal dialog.
])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$uibModal', 'AuthToken','API','$window',function($http, $q, $location, queue, $uibModal,AuthToken,API,$window) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }
const baseUrl =`${API.dev.homeUrl}`;
  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog() {
    if ( loginDialog ) {
      throw new Error('Trying to open a dialog that is already open!');
    }
    //loginDialog = $modal.dialog();
    //loginDialog.open('security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
    loginDialog = $uibModal.open({
      template,
      controller: 'LoginFormController'
    });
    loginDialog.result.then(onLoginDialogClose, onLoginDialogDismiss);
  }
  function closeLoginDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function dismissLoginDialog(reason){
    if(loginDialog){
      loginDialog.dismiss(reason);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      queue.retryAll();
    } else {
      queue.cancelAll();
      redirect();
    }
  }
  //modal is dismissed because escape key press or mouse click outside
  function onLoginDialogDismiss(reason){
    loginDialog = null;
    queue.cancelAll();
    redirect();
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  function processResponse(res){
    return res.data;
  }

  function processError(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  }
  var deferredCurrentUser;

  // The public API of the service
  var service = {

    signup: function(data){
      return $http.post(baseUrl+'/api/signup', data).then(processResponse, processError);
    },

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    socialDisconnect: function(provider){
      var url = baseUrl+'/api/account/settings/' + provider.toLowerCase() + '/disconnect';
      return $http.get(url).then(function(res){ return res.data; });
    },

    socialConnect: function(provider, code){
      var url = baseUrl+'/api/account/settings/' + provider.toLowerCase() + '/callback';
      if(code){
        url += '?code=' + code;
      }
      return $http.get(url).then(function(res){ return res.data; });
    },

    socialLogin: function(provider, code){
      var url =baseUrl+'/api/login/' + provider.toLowerCase() + '/callback';
      if(code){
        url += '?code=' + code;
      }
      var promise = $http.get(url).then(function(res){
        var data = res.data;
        if (data.success) {
          closeLoginDialog(true);
          service.currentUser = data.user;
          $window.location.reload();
        }
        return data;
      });
      return promise;
    },

    // Attempt to authenticate a user by the given username and password
    login: function(username, password) {
      var request = $http.post(baseUrl+'/api/login', {
        username: username,
        password: password
      });
      return request.then(function(response) {
        var data = response.data;
        if(data.success){
          closeLoginDialog(true);
          
          service.currentUser = data.user;
           $window.location.reload();
        }
        return data;
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      //closeLoginDialog(false);
      //redirect();
      dismissLoginDialog('cancel button clicked');
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post(baseUrl+'/api/logout').then(function() {
        service.currentUser = null;
        
        redirect(redirectTo);
      }, function(err){
        console.error(err);
      })
      .finally(function(){
        AuthToken.deleteToken();
      });
    },

    loginForgot: function(data){
      return $http.post(baseUrl+'/api/login/forgot', data).then(processResponse, processError);
    },

    loginReset: function(id, email, data){
      var url =baseUrl+'/api/login/reset/' + email + '/' + id;
      return $http.put(url, data).then(processResponse, processError);
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        // local currentUser is available
        return $q.when(service.currentUser);
      } else if(deferredCurrentUser) {
        // already an outstanding backend request for currentUser
        return deferredCurrentUser.promise;
      } else {
        // no outstanding backend call nor local currentUser
        deferredCurrentUser = $q.defer();
        $http.get(baseUrl+'/api/current-user').then(function(response){
          service.currentUser = response.data.user;
          deferredCurrentUser.resolve(service.currentUser);
          deferredCurrentUser = null;
        }, function(x){
          deferredCurrentUser.reject(x);
          deferredCurrentUser = null;
        });
        return deferredCurrentUser.promise;
      }
    },

    setCurrentUser: function(user){
      service.currentUser = user;
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user an administrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    },

    //Is the current user an hairdresser
    isHairdresser: function(){
      console.log('inside security hairdresser');
      return !!(service.currentUser && service.currentUser.hairdresser);
    },
    //Is the current user is a customer account 
    isAccount:function(){
      return !!(service.currentUser && service.currentUser.account);
    }
  };

  return service;
}]);
