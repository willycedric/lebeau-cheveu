import './home.css';
import {HomeController as controller} from './home.controller';
import template from './home.html';

export const homeDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope: {},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
