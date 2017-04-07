import './hairdresserpicture.css';
import {HairdresserpictureController as controller} from './hairdresserpicture.controller';
import template from './hairdresserpicture-catalogs.html';

export const hairdresserpictureDirective = ()=> {
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
