var config = require('./config/config')
,cloudinary = require('cloudinary')
,fs= require('fs'),
Promise =require('bluebird');

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
