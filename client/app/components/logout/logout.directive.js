import './logout.css';
import {LogoutController as controller} from './logout.controller';
import template from './logout.html';

export const logoutDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	replace:true
	 };
};
