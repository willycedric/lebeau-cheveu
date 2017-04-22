import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {searchbarDirective} from './searchbar.directive';
import './searchbar.scss';
import geolocation from 'angularjs-geolocation';
import ngMap from 'ngmap';
export const searchbar = angular.module('searchbar', [uiRouter,'geolocation','ngMap'])
  .config(($stateProvider) => {
    $stateProvider.state('searchbar', {
      url: '/searchbar',
      params:{
      	selectedLocation:null,
      	selectedCategory:null
      },
      template: '<searchbar></searchbar>'
    })
  })
  .directive('searchbar',searchbarDirective);

