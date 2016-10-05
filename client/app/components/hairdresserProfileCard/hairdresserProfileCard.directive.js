import './hairdresserProfileCard.style.scss';
import template from './hairdresserProfileCard.template.html';
import $ from 'jquery';
export const hairdresserProfileCardDirective = ()=> {
	 return{
	 	template,
	 	restrict:'E',
	 	scope:{},
	 	link: function(scope,elt, attrs){

	 	},
	 	replace:true
	 };
};