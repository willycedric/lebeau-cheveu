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
	    	//var overlayHeight = $(elt).find('.overlay').innerHeight();
	    	//$(elt).find('.overlay').height($(elt).find('.hero-footer').height() +this.innerHeight());
	    	
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
