import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import carousel from 'angular-ui-bootstrap/src/carousel';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup';
import {homeDirective} from './home.directive';
import simpleCard from './simple-card.html';
import cardWithUser from './card-with-user.html';
import './simple-card.css';
import $ from 'jquery';

export const home = angular.module('home', [uiRouter,carousel,datepickerPopup])
  .config(($stateProvider,$urlRouterProvider) => {
  	$urlRouterProvider.otherwise('/home/');
    $stateProvider.state('home', {
      url: '/home/:token',
      template: '<home></home>'
    })
  })  
  .directive('home',homeDirective)
  .directive('simpleCard', ()=>{
    return{
      restrict:'E',
      template:simpleCard,
      scope:{
      	url:'@',
      	name:'@',
      	description:'@'
      },
      replace:true,
    };
  })
  .directive('onCarouselChange', ($parse)=> {
    return {
        require: '^uibCarousel',
        link: function(scope, element, attrs, carouselCtrl) {
            var fn = $parse(attrs.onCarouselChange);
            var origSelect = carouselCtrl.select;
            carouselCtrl.select = function(nextSlide, direction, nextIndex) {
                if (nextSlide !== this.currentSlide) {
                    fn(scope, {
                        nextSlide: nextSlide,
                        direction: direction,
                        nextIndex: carouselCtrl.slides.indexOf(nextSlide)
                    });
                    $(element).find('.carousel-caption').stop();
                }
                return origSelect.apply(this, arguments);
            };
        }
    };
})
.directive('cardWithUser', () =>{
    return{
      restrict:'E',
      template:cardWithUser,
      scope:{
        url:'@',
        user:'@',
        description:'@'
      },
      replace:true,
    };
});