import angular from 'angular';
import uiRouter from 'angular-ui-router';
import $uibModal from 'angular-ui-bootstrap/src/modal';
import {joinDirective} from './join.directive';
import bannerHidden from './banner-hidden-xs.html';
import bannerVisible from './banner-visible-xs.html';
import {ModalInstanceCtrl} from './modalCtrl';
import './banner.css';

export const join = angular.module('join', [uiRouter,$uibModal])
  .config(($stateProvider) => {
    $stateProvider
    .state('join', {
      url: '/join',
      template: '<join></join>'
    })
  })
  .controller('ModalInstanceCtrl',ModalInstanceCtrl)
  .directive('join',joinDirective)
  .directive('joinBannerHidden', () =>{
    return{
      restrict:'E',
      template:bannerHidden,
      scope:{
        url:'@',
        user:'@',
        description:'@',
        loginModal:'&',
        name:'='
      },
      link:function(scope,elt, attrs){
        scope.launch = function(){
          scope.loginModal()();
        }
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
        description:'@',
         loginModal:'&'
      },
      link:function(scope,elt,attrs){
        scope.launch = function(){
          scope.loginModal()();
        }
      },
      replace:true,
    };
});


