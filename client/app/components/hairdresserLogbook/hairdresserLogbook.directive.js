import './hairdresserLogbook.style.scss';
import template from './hairdresserLogbook.template.html';
import $ from 'jquery';
export const hairdresserLogbookDirective = ()=> {
	 return{
	 	template,
	 	restrict:'E',
	 	 scope:{
        days:'=',
        times:'=',
        hours:'='
      },
	 	link: function(scope,elt, attrs){
	 	},
	 	replace:true
	 };
};