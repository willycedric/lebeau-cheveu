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
	 	scope:{},
	 	link:function(scope, elt, atts){		 	
	        const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/lebeaucheveu/image/upload";
	        const CLOUDINARY_UPLAOD_PRESET="fjavb4mb";
	        const CLOUND_NAME ="lebeaucheveu";
	        const API_KEY ="345113751212874";
	        const BACK_END_URL="http://localhost:3500/api/hairdresser/upload";

	       

	        /*
		        //var imgPreview = document.getElementById('img-preview');
		        var fileUpload = document.getElementById('file-upload');

		        fileUpload.addEventListener('change', function(event){
		        	console.log(event);
		        	var file = event.target.files[0];	
		        	var formData = new FormData();
		        	formData.append('file',file);
		        	//formData.append('upload_preset',CLOUDINARY_UPLAOD_PRESET);
		        	axios({
		        		url:BACK_END_URL,
		        		method:'POST',
		        		headers:{
		        			'Content-Type':'application/x-www-form-urlencoded'
		        		},
		        		data:formData
		        	})
		        	.then(function(rep){
		        		//imgPreview.src = rep.data.secure_url;
		        		//console.log(rep.data.secure_url);
		        		console.log(rep);
		        	})
		        	.catch(function(err){
		        		console.error(err);
		        	});
		        });     */

		     
	 	},
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
