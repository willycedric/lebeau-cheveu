import 'normalize.css';
import jQuery from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {appDirective} from './app.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
/*import ngResource from 'angular-resource';*/
import ngAnimate from 'angular-animate';
import uiBootstrap from 'angular-ui-bootstrap';
import ngRoute from 'angular-route'; 
import {baseModule} from './base';
import {config} from './config';
import {account} from './components/account/';
import {servicesI18nNotificationsModule} from './components/common/services/i18nNotifications';
import {servicesHttpRequestTrackerModule} from './components/common/services/httpRequestTracker';
import {securityServiceModule} from './components/common/security/security';
import {home} from './components/home/home';
import {login} from './components/login/login';
import {loginModule} from './components/login/index';
import {admin} from './components/admin/index';
import {join} from './components/join/join';
import {hairdresser} from './components/hairdresser/hairdresser';
import {shared} from './shared/shared';
import {signupModule} from './components/signup/signup';
import {blogModule} from './components/blog/index';
import {catalogModule} from './components/catalog/index';
import {searchbar} from './components/searchbar/searchbar';
import {menu} from './components/menu/menu';
import {uploader} from './components/uploader/uploader';
import moment from 'moment';
import {filepicker} from './filepicker';
import './app.scss';

angular.module('app', [
  uiRouter,
  ngRoute,
  ngAnimate,
  uiBootstrap,
  ngCookies,
  config.name,
  baseModule.name,
  shared.name,
  account.name,
  servicesI18nNotificationsModule.name,
  servicesHttpRequestTrackerModule.name,
  securityServiceModule.name,
  home.name,
  login.name,
  join.name,
   blogModule.name,
   catalogModule.name,
  signupModule.name,
  loginModule.name,
  hairdresser.name,
  admin.name,
  searchbar.name,
  menu.name,
  filepicker.name,
  uploader.name

])
.provider(
        'csrfCD',
        function() {
            'use strict';
            var headerName = 'X-XSRF-TOKEN';
            var cookieName = 'XSRF-TOKEN';
            var allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

            this.setHeaderName = function(n) {
                headerName = n;
            };
            this.setCookieName = function(n) {
                cookieName = n;
            };
            this.setAllowedMethods = function(n) {
                allowedMethods = n;
            };
            this.$get = ['$cookies', function($cookies) {
                return {
                    'request': function(config) {
                        if (allowedMethods.indexOf(config.method) !== -1) {
                            // Read the cookie and set the header
                            config.headers[headerName] = $cookies[cookieName];
                        }
                        return config;
                    }
                };
            }];
})
.config(['$httpProvider','XSRF_COOKIE_NAME', 'csrfCDProvider',function($httpProvider, XSRF_COOKIE_NAME,csrfCDProvider){
    $httpProvider.defaults.xsrfCookieName = XSRF_COOKIE_NAME;
    $httpProvider.defaults.withCredentials = true;
   /* $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};*/
   // csrfCDProvider.setHeaderName('X-XSRF-TOKEN');
    //csrfCDProvider.setCookieName(XSRF_COOKIE_NAME);
    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.config(['$locationProvider', function ( $locationProvider) {
  $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
  });
}])
.run(['$location', '$rootScope', 'security', function($location, $rootScope, security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();

  // add a listener to $routeChangeSuccess
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    $rootScope.title = current.$$route && current.$$route.title? current.$$route.title: 'Drywall is Running';
  });
}])
.directive('app', appDirective)
.directive('serverError', [ function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      replace: true,
      link: function (scope, element, attrs, ctrl) {
        element.on('change', function(){
          scope.$apply(function(){
            ctrl.$setValidity('server', true);
          });
        });
      }
    };
  }])
.directive('lightboxDirective', function() {
  return {
    restrict: 'E', // applied on 'element'
    transclude: true, // re-use the inner HTML of the directive
    template: '<section ng-transclude></section>', // need this so that inner HTML will be used
  }
});