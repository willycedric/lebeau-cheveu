import './searchbar.css';
import {SearchbarController as controller} from './searchbar.controller';
import template from './searchbar.html';

export const searchbarDirective = ()=> {
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
