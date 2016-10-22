import './hairdresserBooking.css';
import {HairdresserBookingController as controller} from './hairdresserBooking.controller';
import template from './hairdresserBooking.html';

export const hairdresserBookingDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
