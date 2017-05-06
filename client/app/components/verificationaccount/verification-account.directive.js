import './verification-account.css';
import {VerificationaccountController as controller} from './verification-account.controller';
import template from './verification-account.html';

export const verificationaccountDirective = ()=> {
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
