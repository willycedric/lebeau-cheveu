import './hairdresserAccount.css';
import {HairdresserAccountController as controller} from './hairdresserAccount.controller';
import template from './hairdresserAccount.html';

export const hairdresserAccountDirective = ()=> {
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
