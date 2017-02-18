import './accountbooking.css';
import {AccountbookingController as controller} from './accountbooking.controller';
import template from './accountbooking.tpl.html';

export const accountbookingDirective = ()=> {
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
