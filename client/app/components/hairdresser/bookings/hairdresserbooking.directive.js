import './hairdresserbooking.css';
import {HairdresserbookingController as controller} from './hairdresserbooking.controller';
import template from './hairdresserbooking.html';

export const hairdresserbookingDirective = ()=> {
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
