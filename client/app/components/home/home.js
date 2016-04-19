import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import carousel from 'angular-ui-bootstrap/src/carousel';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup';
import {homeDirective} from './home.directive';

export const home = angular.module('home', [carousel,datepickerPopup])
  .config(($stateProvider,$urlRouterProvider) => {
  	$urlRouterProvider.otherwise('/home');
    $stateProvider.state('home', {
      url: '/home',
      template: '<home></home>'
    })
  })
  
  .directive('home',homeDirective);

  