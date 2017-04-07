import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {uploaderDirective} from './uploader.directive';
import {servicesHairdresserResourceModule} from './../common/services/hairdresserResource';
import './uploader.scss';
import ngFileUpload from 'ng-file-upload';
import ngImgCrop from './../../../../node_modules/ng-img-crop/compile/minified/ng-img-crop';
import   './../../../../node_modules/ng-img-crop/compile/minified/ng-img-crop.css';

export const uploader = angular.module('uploader', [uiRouter,servicesHairdresserResourceModule.name,ngFileUpload,'ngImgCrop']);
  uploader.config(($stateProvider) => {
    $stateProvider.state('uploader', {
      url: '/uploader',
      template: '<uploader></uploader>'
    });
  });  
  uploader.directive('uploader',uploaderDirective);


