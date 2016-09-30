import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdressersDirective} from './hairdressers.directive';
import hairdresser from './hairdresser-template.html';
import './hairdresser-template.css';

export const hairdressers = angular.module('hairdressers', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdressers', {
      url: '/hairdressers',
      template: '<hairdressers></hairdressers>'
    })
  })
  .directive('hairdressers',hairdressersDirective)
  .directive('hairdresserCard', () =>{
	  	return {
	  		restrict:'E',
	      template:hairdresser,
	      scope:{
	        url:'@',
	        id:'@',
	        description:'@'
	      },
	      replace:true,
	 };
})

