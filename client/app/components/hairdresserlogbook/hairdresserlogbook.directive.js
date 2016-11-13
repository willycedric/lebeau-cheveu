import './hairdresserlogbook.css';
import {HairdresserlogbookController as controller} from './hairdresserlogbook.controller';
import template from './hairdresserlogbook.html';
import $ from 'jquery';
export const hairdresserlogbookDirective = ()=> {
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
