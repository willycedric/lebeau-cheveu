import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserdescriptionDirective} from './hairdresser-edit-description.directive';
import template from './hairdresser-edit-description.tpl.html';
import './hairdresser-edit-description.scss';

export const hairdresserdescription = angular.module('hairdresserdescriptionedit', [uiRouter])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdresserdescriptionedit', {
      url: '/hairdresser/description/edit/',
      template:'<hairdresserdescription></hairdresserdescription>',
    })
  })
  .directive('hairdresserdescription',hairdresserdescriptionDirective);

