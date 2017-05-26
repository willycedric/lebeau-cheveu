import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserareaDirective} from './hairdresser-edit-area.directive';
import template from './hairdresser-edit-area.tpl.html';
import './hairdresser-edit-area.scss';

export const hairdresserarea = angular.module('hairdresserareaedit', [uiRouter])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdresserareaedit', {
      url: '/hairdresser/area/edit/',
      template:'<hairdresserarea></hairdresserarea>',
      params:{area:null}
    })
  })
  .directive('hairdresserarea',hairdresserareaDirective);

