import './showhairdresserprofile.css';
import './showhairdresserProfile.scss';
import {ShowhairdresserprofileController as controller} from './showhairdresserprofile.controller';
import template from './showhairdresserprofile.html';
import $ from 'jquery';

export const showhairdresserprofileDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
	 	link: function(scope, elt, atts){
   		 },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
