import './error.css';
import {ErrorController as controller} from './error.controller';
import template from './error.html';

export const errorDirective = ()=> {
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
