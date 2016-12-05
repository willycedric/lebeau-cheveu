import './customermessages.css';
import {CustomermessagesController as controller} from './customermessages.controller';
import template from './customermessages.html';

export const customermessagesDirective = ()=> {
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
