import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import 'bootstrap/dist/css/bootstrap.css';
import carousel from 'angular-ui-bootstrap/src/carousel';
import {banniereDirective} from './banniere.directive';

export const banniere = angular.module('banniere', ['ui.router',ngAnimate,carousel])
  .config(($stateProvider) => {
    $stateProvider.state('banniere', {
      url: '/banniere',
      template: '<banniere></banniere>'
    })
  })
  
  .directive('banniere',banniereDirective);

  