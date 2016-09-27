import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'bootstrap/dist/css/bootstrap.css';
import carousel from 'angular-ui-bootstrap/src/carousel';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup';
import {homeDirective} from './home.directive';
import template from './simple-card.html';
import './simple-card.css';

export const home = angular.module('home', [uiRouter,carousel,datepickerPopup])
  .config(($stateProvider,$urlRouterProvider) => {
  	$urlRouterProvider.otherwise('/home/');
    $stateProvider.state('home', {
      url: '/home/:token',
      template: '<home></home>'
    })
  })  
  .directive('home',homeDirective)
  .directive('simpleCard', ()=>{
    return{
      restrict:'E',
      template,
      scope:{
      	url:'@',
      	name:'@',
      	description:'@'
      },
      replace:true,
    };
  });


  