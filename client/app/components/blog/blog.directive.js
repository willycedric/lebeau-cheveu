import './blog.css';
import {BlogController as controller} from './blog.controller';
import template from './blog.html';

export const blogDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope: {},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
