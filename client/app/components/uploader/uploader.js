import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {uploaderDirective} from './uploader.directive';
import {servicesHairdresserResourceModule} from './../common/services/hairdresserResource';
import './uploader.scss';


export const uploader = angular.module('uploader', [uiRouter,servicesHairdresserResourceModule.name]);
  uploader.config(($stateProvider,filepickerProvider) => {
    $stateProvider.state('uploader', {
      url: '/uploader',
      template: '<uploader></uploader>'
    });
    filepickerProvider.setKey('ABrnOuqcdQNWYpRtW1j7wz');
  });  
  uploader.directive('uploader',uploaderDirective);


