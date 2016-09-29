import './join.css';
import {JoinController as controller} from './join.controller';
import template from './join.html';
import $ from 'jquery';

export const joinDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E', 
	 	scope:{},
        link: function(scope, elt, atts){
	    	$(elt).find('.banner').height();
	    	console.log($('.banner').innerHeight(), $('.banner').height());
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};