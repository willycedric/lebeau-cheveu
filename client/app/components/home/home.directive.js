import './home.css';
import {HomeController as controller} from './home.controller';
import template from './home.html';
import $ from 'jquery';

export const homeDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope: {},
	    link: function(scope, elt, atts){
                var scrollStart =0;
                var startChange = $(elt).find("#home-start-change");
                var offset = startChange.offset();
                $(elt).find(".navbar-default").css('background-color', '#fff');
                console.log('navbar-default ',$(elt).find(".navbar-default"));
	    	if (startChange.length){
                    $(document).scroll(function() { 
                       scroll_start = $(this).scrollTop();
                       if(scroll_start > offset.top) {
                           $(elt).find(".navbar-default").css('background-color', '#fff');
                        } else {
                           $(elt).find('.navbar-default').css('background-color', 'transparent');
                        }
                    });
                }
           
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
