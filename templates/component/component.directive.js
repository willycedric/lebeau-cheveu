import './<%= name %>.css';
import {<%= upCaseName %>Controller as controller} from './<%= name %>.controller';
import template from './<%= name %>.html';

export const <%= name %>Directive = ()=> {
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
