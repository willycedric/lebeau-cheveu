import './admin.css';
import {AdminController as controller} from './admin.controller';
import template from './admin.html';

export const adminDirective = ()=> {
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
