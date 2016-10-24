import './hairdresseraccount.css';
import {HairdresseraccountController as controller} from './hairdresseraccount.controller';
import template from './hairdresseraccount.html';

export const hairdresseraccountDirective = ()=> {
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
