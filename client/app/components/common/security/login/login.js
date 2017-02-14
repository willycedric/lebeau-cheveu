import {securityLoginFormModule} from './LoginFormController';
import {securityLoginToolbarModule} from  './toolbar';
export const securityLoginModule = angular.module('securityLoginModule', 
	[securityLoginFormModule.name,
	 securityLoginToolbarModule.name
]);