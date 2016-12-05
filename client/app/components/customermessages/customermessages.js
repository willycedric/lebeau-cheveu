import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {customermessagesDirective} from './customermessages.directive';
import './customermessages.scss';

export const customermessages = angular.module('customermessages', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('customermessages', {
      url: '/customermessages',
      template: '<customermessages></customermessages>'
    })
  })
  .directive('customermessages',customermessagesDirective);

