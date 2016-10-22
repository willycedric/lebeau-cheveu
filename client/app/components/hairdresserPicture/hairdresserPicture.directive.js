import './hairdresserPicture.css';
import {HairdresserPictureController as controller} from './hairdresserPicture.controller';
import template from './hairdresserPicture.html';

export const hairdresserPictureDirective = ()=> {
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
