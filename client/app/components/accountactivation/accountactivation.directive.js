import './accountactivation.css';
import {AccountactivationController as controller} from './accountactivation.controller';
import template from './accountactivation.html';

export const accountactivationDirective = ()=> {
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
