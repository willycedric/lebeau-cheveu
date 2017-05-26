import {HairdresserdescriptionController as controller} from './hairdresser-edit-description.controller';
import template from './hairdresser-edit-description.tpl.html';
import $ from 'jquery';
export const hairdresserdescriptionDirective = ()=> {
	 return{
	 	 template,
		 controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
		 link: function(scope, elt, atts){                        
                     
	    },
	 	replace:true	 	
	 };
};
