import './galeria.css';
import {GaleriaController as controller} from './galeria.controller';
import template from './galeria.html';

export const galeriaDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope: {},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
