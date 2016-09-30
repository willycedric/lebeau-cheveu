import './hairdressers.css';
import {HairdressersController as controller} from './hairdressers.controller';
import template from './hairdressers.html';
export const hairdressersDirective = ()=> {
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
