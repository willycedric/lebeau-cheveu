const authFactory = ($http, $window,$q,API) =>{
	let userInfo={};

	const login = (email,password) =>{
  			var deferred = $q.defer();
  			$http.post(`${API.url}`+'/api/users/me',{email:email,password:password})
  				.then(function loginSuccessCallBack(response){
  					if(response.data.status=="ok"){
  						userInfo={
  							accessToken:response.data.token,
  							user:response.data.user
  						};
  						//set the Authorization header to all the future http request
  						$http.defaults.headers.common['Authorization'] = 'JWT '+response.data.token;
  						$window.sessionStorage["user"] = JSON.stringify(userInfo);
  						deferred.resolve(userInfo);
  					}else{
  						deferred.reject(error);
  					}
  				}, function loginErrorCallBack(error){
  						deferred.reject(error);
  				});
			return deferred.promise;
	};

	const logout = () =>{
		 $http({
                url:`${API.url}`+'/api/users/logout',
                method:'GET'
            })
            .then( function logoutSuccessCallback(response){
            	//clean the http Authorization header
                $http.defaults.headers.common['Authorization'] = '';
                //clean the userInfo object
                userInfo={};
                //clean the session object
                $window.sessionStorage["user"]=JSON.stringify({});
                //redirect to the home page
                //$window.location.href=`${API.home}`;
            },function logoutErrorCallback (err){
                console.error(err);
            });

	};

	const getUserInfo = ()=>{
		return userInfo;
	};

	const dire = (name)=>{
		console.log('dire ', name);
	}
	return {
		login,
		getUserInfo,
		logout,
		dire
	};
	
};

authFactory.$inject = ['$http','$window','$q','API'];

export {authFactory};