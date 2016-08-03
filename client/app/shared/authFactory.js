const authFactory = ($http, $window,$q,API,AuthToken) =>{
	let userInfo={};

  /**
   * [register a user with valid informations]
   * @param  {[user's object]} user [user'email and password]
   * @return {[http promise]}      [http promise which will be resolved in the user profile controller]
   */
  const register = (user)=>{
    return $http.post(`${API.homeUrl}`+'/api/users',user);
  }

  /**
   * [login the registered user and saved the jwtToken in the local storage]
   * @param  {[string]} email    [user email]
   * @param  {[string]} password [user password]
   
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
              console.log('Token '+JSON.stringify(AuthToken.parseToken(AuthToken.getToken())));
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
   * [logout the connected user]
   */
	const logout = () =>{
    var deferred = $q.defer();
		 return $http({ 
                url:`${API.homeUrl}`+'/api/users/logout',
                method:'GET',
            })
            .then( function logoutSuccessCallback(response){
              if(response.data.message ==="OK"){
                  //clean the http Authorization header
                  $http.defaults.headers.common['Authorization'] = '';
                
                  //clean the session object
                  AuthToken.deleteToken();
                  deferred.resolve(userInfo);
              }else{
                deferred.reject(new Error("There are some issues with user logout"));
              }
            	
            },function logoutErrorCallback (err){
               deferred.reject(err);
            });
            return deferred.promise;

	};
  /**
   * [Test function used to see if the connected user can retrieve his informations from the remote server ]
   * @return {[type]} [description]
   */
	const getUserInfo = ()=>{
		return userInfo;
	};

	return {
		login,
		getUserInfo,
		logout,
    register
	};
	
};

authFactory.$inject = ['$http','$window','$q','API','AuthToken'];

export {authFactory};