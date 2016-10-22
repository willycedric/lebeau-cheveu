import './hairdresserLogbook.css';
import {HairdresserLogbookController as controller} from './hairdresserLogbook.controller';
import template from './hairdresserLogbook.html';

export const hairdresserLogbookDirective = ()=> {
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
