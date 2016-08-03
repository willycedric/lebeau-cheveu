import './cart.css';
import {CartController as controller} from './cart.controller';
import template from './cart.html';

export const cartDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	replace:true
	 };
};
