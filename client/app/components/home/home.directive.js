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
	    	//console.log("value entered: ",$(elt).find('.location').val());
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
