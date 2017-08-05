import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
//import carousel from 'angular-ui-bootstrap/src/carousel';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup';
import {homeDirective} from './home.directive';
import simpleCard from './simple-card.html';
import cardWithUser from './card-with-user.html';
import './simple-card.css';
import './home.scss';
import $ from 'jquery';

export const home = angular.module('home', [uiRouter,datepickerPopup])
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
      template:simpleCard,
      scope:{
      	url:'@',
      	name:'@',
      	description:'@'
      },
      replace:true,
    };
  })
.directive('cardWithUser', () =>{
    return{
      restrict:'E',
      template:cardWithUser,
      scope:{
        url:'@',
        user:'@',
        description:'@',
        hairdresser:'@',
        redirectTo:'&'
      },
      replace:true,
    };
});