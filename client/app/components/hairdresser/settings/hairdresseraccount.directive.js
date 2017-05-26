import './hairdresseraccount.css';
import {HairdresseraccountController as controller} from './hairdresseraccount.controller';
import template from './hairdresseraccount.html';
import $ from 'jquery';
export const hairdresseraccountDirective = ()=> {
	 return{
	 	 template,
		 controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
		 link: function(scope, elt, atts){
                
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
