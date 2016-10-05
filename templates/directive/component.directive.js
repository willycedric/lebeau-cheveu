import './<%= name %>.style.scss';
import template from './<%= name %>.template.html';
import $ from 'jquery';
export const <%= name %>Directive = ()=> {
	 return{
	 	template,
	 	restrict:'E',
	 	scope:{},
	 	link: function(scope,elt, attrs){

	 	},
	 	replace:true
	 };
};