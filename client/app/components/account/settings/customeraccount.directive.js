import './customeraccount.css';
import {CustomeraccountController as controller} from './customeraccount.controller';
import template from './customeraccount.html';

export const customeraccountDirective = ()=> {
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
