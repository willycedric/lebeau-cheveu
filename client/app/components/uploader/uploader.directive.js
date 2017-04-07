import './uploader.css';
import {UploaderController as controller} from './uploader.controller';
import template from './uploader.html';
import $ from 'jquery';
import cloudinary from 'cloudinary-jquery-file-upload';
export const uploaderDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{
	        url:'@',
	        destination:'@'
      	},
	 	link:function(scope, elt, atts){		 		        	
	        	$(document).ready(function(){	        		
	        		var child = document.getElementsByClassName('profile-update');
	        		$(elt).on('mouseenter','.profile-container', function(){	        			
	        			child[0].style.visibility="visible";        			
	        		});
	        		$(elt).on('mouseleave','.profile-container',function(){        			
	        			child[0].style.visibility="hidden";	        			
	        		});       	       		
	        	});	     
	 	},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
