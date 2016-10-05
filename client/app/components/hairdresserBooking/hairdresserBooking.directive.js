import './hairdresserBooking.style.scss';
import template from './hairdresserBooking.template.html';
import $ from 'jquery';
export const hairdresserBookingDirective = ()=> {
	 return{
	 	template,
	 	restrict:'E',
	 	scope:{
	 		val:'='
	 	},
	 	link: function(scope,elt, attrs){
	 	},
	 	replace:true
	 };
};