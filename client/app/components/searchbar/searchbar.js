import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {searchbarDirective} from './searchbar.directive';
import './searchbar.scss';

export const searchbar = angular.module('searchbar', [uiRouter])
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

