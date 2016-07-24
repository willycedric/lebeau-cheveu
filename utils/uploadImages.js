var config = require('./config/config')
,cloudinary = require('cloudinary')
,fs= require('fs'),
Promise =require('bluebird');

/*var uploadImage = function(){
	
	var images=['banner1.jpg','banner5.jpg','banner8.jpg','banner6.jpg','banner7.jpg'];
	var imageDetails=[];
    images.forEach(function(elt){
	    cloudinary.uploader.upload(__dirname+'/utils/images/'+elt,function(err,result){
	        imagesDetails.push({
	          url: result.secure_utl,
	          width:result.width,
	          height:result.height,
	          create_at:result.create_at
	        });
	     });
	  });

};*/


module.exports = function(elt){
	cloudinary.config(require('./config/config').cloudinary);
	return new Promise(function(resolve,reject){
		cloudinary.uploader.upload(__dirname+'/images/'+elt, function(result){
				if(!result.hasOwnProperty('error')){
					resolve(result);
				}else{
					reject(new Error(result.error));
				}
		});
	});
};

/*module.exports = function(){
	return new Promise(function(resole,reject){
			if(uploadImage(fileName)){
				resolve(uploadImage(fileName));
			}else{
				reject(new Error(" file "+fileName+" can't be loaded"));
			}
	});
};*/
