import './app.css';
import $ from 'jquery';
import Slideout from 'slideout/dist/slideout.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import template from './app.html';
import {AppController as controller} from './app.controller';

export const appDirective = ($uibModal)=> {
  return {
    template,
    controller,
    controllerAs:'vm',
    restrict: 'E',
    scope: {},
    link: function(scope, elt, atts){
      	$(elt).find('#cssmenu').menumaker({
     			format: "multitoggle",
          element:elt
  		});   
        $(elt).find('#menu').hide();
        $(elt).find('.toggle-button').hide();
        /*scope.openModal = function() {
              console.log('inside the modal');
              var modalInstance = $uibModal.open({
                animation: true,
                template:'<login></login>',
                controller
                scope: scope,
                size: 'lg'
              });
            };*/
      
        /*$(elt).find('.login').on('click', function(evt){
          evt.preventDefault();
          console.log('in the menu');
          //scope.openModal();
        });*/
    },
    replace: true
  };
};

$.fn.menumaker = function(options) {  
 var cssmenu = $(this), settings = $.extend({
   format: "dropdown",
   sticky: false
 }, options);
 return this.each(function() {


 	if($(this).find("cssmenu").hasClass("has-sub")){
 		console.log("oh yeah");
 	}
 	
 	var self;
 	$(this).find("dropdown").removeClass("has-sub");
   $(this).find(".button").on('click', function(){
   	self= $(this);
     $(this).toggleClass('menu-opened');
     var mainmenu = $(this).next('ul');
     if (mainmenu.hasClass('open')) { 
       mainmenu.slideToggle().removeClass('open');
      
     }
     else {
              
     	
       //mainmenu.slideToggle().addClass('open');
       
      /* mainmenu.find("li").on('click',function(){
       		
   	 		self.removeClass('menu-opened');
   	 		mainmenu.fadeOut(100);
   	 	});*/
       if (settings.format === "dropdown") {
         mainmenu.find('ul').show();
         console.log('dans le if du else');
       }
     }
   });
   cssmenu.find('li ul').parent().addClass('has-sub');
 var multiTg = function() {
     cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
     cssmenu.find('.submenu-button').on('click', function() {
       $(this).toggleClass('submenu-opened');
       if ($(this).siblings('ul').hasClass('open')) {
         $(this).siblings('ul').removeClass('open').slideToggle();
       }
       else {
         $(this).siblings('ul').addClass('open').slideToggle();
       }
     });
   };
   if (settings.format === 'multitoggle') multiTg();
   else cssmenu.addClass('dropdown');
   if (settings.sticky === true) cssmenu.css('position', 'fixed');
 var resizeFix = function() {
  var mediasize = 700;
     if ($( window ).width() > mediasize){
       cssmenu.find('ul').show();

     }
     if ($(window).width() <= mediasize) {
       cssmenu.hide();
       var slideout = new Slideout({
          'panel': document.getElementById('panel'),
          'menu': document.getElementById('menu'),
          'padding': 256,
          'tolerance': 70
        });
       document.querySelector('.toggle-button').addEventListener('click', function() {
          slideout.toggle();
        });       
      //$(elt).find('.toggle-button').show();
      settings.element.find('.toggle-button').show();
     
       //cssmenu.find('ul').hide().removeClass('open');
     }
   };
   resizeFix();
   return $(window).on('resize', resizeFix);
 });
  };

