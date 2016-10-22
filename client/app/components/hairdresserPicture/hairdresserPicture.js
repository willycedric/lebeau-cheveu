import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserPictureDirective} from './hairdresserPicture.directive';

export const hairdresserPicture = angular.module('hairdresserPicture', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresserPicture', {
      url: '/hairdresserPicture',
      template: '<hairdresserPicture></hairdresserPicture>'
    })
  })
  .directive('hairdresserPicture',hairdresserPictureDirective);

