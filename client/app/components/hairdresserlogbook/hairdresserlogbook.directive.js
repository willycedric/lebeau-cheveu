import './hairdresserlogbook.css';
import {HairdresserlogbookController as controller} from './hairdresserlogbook.controller';
import template from './hairdresserlogbook.html';
import $ from 'jquery';
export const hairdresserlogbookDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
	 	link:function(scope,elt,attrs){
	 		console.log('inside the directive');
	 		$(elt).find('.uib-datepicker').find('td').find('.uib-day').on('click', (evt)=>{
	 				evt.preventDefault();
	 				console.log('click on the table', $(this).val());
	 		});
	 	},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
