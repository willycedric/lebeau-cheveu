import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdressersettingsDirective} from './hairdresser-edit-setting.directive';
import template from './hairdresser-edit-setting.tpl.html';
import './hairdresser-edit-setting.scss';

export const hairdressersetting = angular.module('hairdressersettingsedit', [uiRouter])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdressersettingsedit', {
      url: '/hairdresser/settings/edit/',
      template:'<hairdressersettings></hairdressersettings>',
      params:{details:null}
    })
  })
  .directive('hairdressersettings',hairdressersettingsDirective);

