import './forgot.css';
import {ForgotController as controller} from './forgot.controller';
import template from './forgot.html';
import './forgot.scss';
import $ from 'jquery';
export const forgotDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
		 link:function(scope,elt,atts){
			$(document).ready(function(){
					var scroll_start = 0;
                    var startchange = $(elt).find('#start-change');
                    var offset = startchange.offset();                    
                     if (startchange.length){
                    $(document).scroll(function() { 
                       scroll_start = $(this).scrollTop();
                       if(scroll_start > 40) {
                           //$(".navbar-default").css('background-color', '#f0f0f0');
                           $('.navbar-default').addClass('transparent');
                        } else {
                           //$('.navbar-default').css('background-color', 'transparent');
                           $('.navbar-default').removeClass('transparent');
                        }
                    
                    });
                   }
			});
		 },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
