import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {appDirective} from './app.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
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
import {join} from './components/join/join';
import {shared} from './shared/shared';
import {signupModule} from './components/signup/signup';
angular.module('app', [
  uiRouter,
  ngRoute,
  ngAnimate,
  uiBootstrap,
  config.name,
  baseModule.name,
  account.name,
  servicesI18nNotificationsModule.name,
  servicesHttpRequestTrackerModule.name,
  securityServiceModule.name,
  home.name,
  login.name,
  join.name,
  shared.name,
  signupModule.name,
  loginModule.name
])
.config(['$httpProvider','XSRF_COOKIE_NAME', function($httpProvider, XSRF_COOKIE_NAME){
    $httpProvider.defaults.xsrfCookieName = XSRF_COOKIE_NAME;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
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
  }]);


