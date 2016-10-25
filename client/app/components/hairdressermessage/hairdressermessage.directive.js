import './hairdressermessage.css';
import {HairdressermessageController as controller} from './hairdressermessage.controller';
import template from './hairdressermessage.html';

export const hairdressermessageDirective = ()=> {
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
