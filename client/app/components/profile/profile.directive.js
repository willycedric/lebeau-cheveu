import './profile.css';
import {ProfileController as controller} from './profile.controller';
import template from './profile.html';

export const profileDirective = ()=> {
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
