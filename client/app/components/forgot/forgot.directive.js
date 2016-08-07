import './forgot.css';
import {ForgotController as controller} from './forgot.controller';
import template from './forgot.html';

export const forgotDirective = ()=> {
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
