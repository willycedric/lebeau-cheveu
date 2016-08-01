const authFactory = ($http, $window,$q,API) =>{
	let userInfo={};

  /**
   * [description]
   * @param  {[type]} email    [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
	const login = (email,password) =>{
  			var deferred = $q.defer();
  			$http.post(`${API.homeUrl}`+'/api/users/me',{email:email,password:password})
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
  						deferred.reject(new Error("There are some issues with user login"));
  					}
  				}, function loginErrorCallBack(err){
  						deferred.reject(err);
  				});
			return deferred.promise;
	};

  /**
   * [description]
   * @return {[type]} [description]
   */
	const logout = () =>{
    var deferred = $q.defer();
		 return $http({ 
                url:`${API.homeUrl}`+'/api/users/logout',
                method:'GET',
                headers:{
                  'Authorization':'JWT '+JSON.parse($window.sessionStorage["user"]).accessToken
                }
            })
            .then( function logoutSuccessCallback(response){

              if(response.data.message ==="OK"){
                  //clean the http Authorization header
                  $http.defaults.headers.common['Authorization'] = '';
                  //clean the userInfo object
                  userInfo={
                    empty:"empty"
                  };
                  //clean the session object
                  delete $window.sessionStorage["user"];
                  //redirect to the home page
                  //$window.location.href=`${API.home}`;
                  deferred.resolve(userInfo);
              }else{
                deferred.reject(new Error("There are some issues with user logout"));
              }
            	
            },function logoutErrorCallback (err){
               deferred.reject(err);
            });
            return deferred.promise;

	};

  const register = (user)=>{
    return $http.post(`${API.homeUrl}`+'/api/users',user);
  }


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
		dire,
    register,
    me
	};
	
};

authFactory.$inject = ['$http','$window','$q','API'];

export {authFactory};