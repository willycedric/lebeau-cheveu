import './hairdresseraccount.css';

import template from './hairdresseraccount.html';

export const hairdresseraccountDirective = ()=> {
	 return{
	 	template,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
