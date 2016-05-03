import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {galeriaDirective} from './galeria.directive';

export const galeria = angular.module('galeria', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('galeria', {
      url: '/galeria',
      template: '<galeria></galeria>'
    })
  })
  .directive('galeria',galeriaDirective);

