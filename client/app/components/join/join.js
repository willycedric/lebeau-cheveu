import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {joinDirective} from './join.directive';
import bannerHidden from './banner-hidden-xs.html';
import bannerVisible from './banner-visible-xs.html';

import './banner.css';

export const join = angular.module('join', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('join', {
      url: '/join',
      template: '<join></join>'
    })
  })
  .directive('join',joinDirective)
  .directive('joinBannerHidden', () =>{
    return{
      restrict:'E',
      template:bannerHidden,
      scope:{
        url:'@',
        user:'@',
        description:'@'
      },
      replace:true,
    };
})
.directive('joinBannerVisible', () =>{
    return{
      restrict:'E',
      template:bannerVisible,
      scope:{
        url:'@',
        user:'@',
        description:'@'
      },
      replace:true,
    };
});


