import './banniere.css';
import {BanniereController as controller} from './banniere.controller';
import template from './banniere.html';

export const banniereDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	replace:true
	 };
};
