import './hairdresserpicture.css';
import {HairdresserCatalogController as controller} from './hairdresser-catalog.controller';
import template from './hairdresser-catalog.tpl.html';

export const hairdressercatalogDirective = ()=> {
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
