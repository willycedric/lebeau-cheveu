const authFactory = ($http, $window,$q,API) =>{
	let userInfo={};

  
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
  						//set the Authorization header to all the future http request
  						//$http.defaults.headers.common['Authorization'] = 'JWT '+response.data.token;
  						//$window.sessionStorage["user"] = JSON.stringify(userInfo);
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
   *
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

  /**
   * [register a user with valid informations]
   * @param  {[user's object]} user [user'email and password]
   * @return {[http promise]}      [http promise which will be resolved in the user profile controller]
   */
  const register = (user)=>{
    return $http.post(`${API.homeUrl}`+'/api/users',user);
  }

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

authFactory.$inject = ['$http','$window','$q','API'];

export {authFactory};