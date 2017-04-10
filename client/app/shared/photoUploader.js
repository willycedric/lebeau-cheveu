const PhotoUploader = (securityAuthorization,$http)=>{
		  const baseUrl = 'http://localhost:3500/api';
		  const processResponse = function(res){
		    return res.data;
		  };
		  const processError = function(e){
		    var msg = [];
		    if(e.status)         { msg.push(e.status); }
		    if(e.statusText)     { msg.push(e.statusText); }
		    if(msg.length === 0) { msg.push('Unknown Server Error'); }
		    return $q.reject(msg.join(' '));
		  };

		const updateProfilePhoto = (user,photo)=>{		
			if(user.hairdresser){

				return $http.put(baseUrl+'/hairdresser/upload',{photo:photo});
			}
			if(user.account){
				return $http.put(baseUrl+'/account/upload',{photo:photo});
			}
		};

		return {
			updateProfilePhoto
		};
};

PhotoUploader.$inject=['securityAuthorization','$http'];

export {PhotoUploader};
