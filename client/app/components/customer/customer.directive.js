import './customer.css';
import {CustomerController as controller} from './customer.controller';
import template from './customer.html';
import './customer.scss';
export const customerDirective = ()=> {
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
