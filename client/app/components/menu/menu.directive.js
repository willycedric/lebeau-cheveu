import './menu.css';
import {MenuController as controller} from './menu.controller';
import template from './menu.html';

export const menuDirective = ()=> {
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
