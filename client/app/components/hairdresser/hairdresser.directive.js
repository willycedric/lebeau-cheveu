import {HairdresserController as controller} from './hairdresser.controller';
import template from './hairdresser.html';

export const hairdresserDirective = ()=> {
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
