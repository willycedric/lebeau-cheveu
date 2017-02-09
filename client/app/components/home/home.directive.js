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
                $(document).ready(function(){  
                  $(".lebeaucheveu-logo").css('left','0');
                  $(".lebeaucheveu-logo").css('margin-top','0');       
                    var scroll_start = 0;
                    var startchange = $(elt).find('#home-start-change');
                    var offset = startchange.offset();
                     if (startchange.length){
                    $(document).scroll(function() { 
                       scroll_start = $(this).scrollTop();
                       if(scroll_start > offset.top) {
                           $(".navbar-default").css('background-color', '#f0f0f0');
                        } else {
                           $('.navbar-default').css('background-color', 'transparent');
                        }
                    });
                     }
                 });

	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
