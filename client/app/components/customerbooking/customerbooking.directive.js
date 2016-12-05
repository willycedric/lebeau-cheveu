import './customerbooking.css';
import {CustomerbookingController as controller} from './customerbooking.controller';
import template from './customerbooking.html';

export const customerbookingDirective = ()=> {
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
