import './accountmessages.css';
import {AccountmessagesController as controller} from './accountmessages.controller';
import template from './accountmessages.tpl.html';

export const accountmessagesDirective = ()=> {
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
