const authFactory = ($http, $window,$q,API,AuthToken) =>{
	let userInfo={};
  let apiUrl=`${API.dev.homeUrl}`;
  /**
   * [register a user with valid informations]
   * @param  {[user's object]} user [user'email and password]
   * @return {[http promise]}      [http promise which will be resolved in the user profile controller]
   */
  const register = (user)=>{
    return $http.post(apiUrl+'/api/users',user);
  }

  /**
   * [login the registered user and saved the jwtToken in the local storage]
   * @param  {[string]} email    [user email]
   * @param  {[string]} password [user password]
   
   */
	const login = (username,password) =>{
  			var deferred = $q.defer();
  			$http.post(apiUrl+'/api/users/me',{userName:username,password:password})
  				.then(function loginSuccessCallBack(response){
  					if(response.data.status=="ok"){
  						userInfo={
  							accessToken:response.data.token,
  							user:response.data.user
  						};
              //console.log('Token '+JSON.stringify(AuthToken.parseToken(AuthToken.getToken())));
  						deferred.resolve(userInfo);
  					}else{
  						deferred.reject(new Error("There are some issues with user login"));
  					}
  				}, function loginFailureCallBack(err){
  						deferred.reject(err);
  				});
			return deferred.promise;
	};
 

  /**
   * [logout the connected user]
   */
	const logout = () =>{
    var deferred = $q.defer();
		$http({ 
                url:apiUrl+'/api/users/logout',
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

  const passwordForgot = (email)=>{
    var deferred = $q.defer();
    $http.post(apiUrl+'/api/users/forgot',{email:email})
            .then(function forgotSuccessCallback(response){
                deferred.resolve(response);
            }, function forgotErrorCallback(err){
              deferred.reject(err);
            });
            return deferred.promise;
  };

  const resetPassword = (token) =>{
    var deferred = $q.defer();
    $http.post(apiUrl+'/api/users/reset',{token:token})
    .then(function resetPasswordSuccessCallback(response){
        deferred.resolve(response);
    }, function resetPasswordFailureCallback(err){
        deferred.reject(err);
    });
    return deferred.promise;
  };

  const updatePassword = (user)=>{
    console.log(JSON.stringify(user));
    var deferred = $q.defer();
    $http.post(apiUrl+'/api/users/updatePassword',{token:user.passwordToken,password:user.password})
    .then(function updatePasswordSuccessCallback(response){
          deferred.resolve(response);
    },function updatePasswordFailureCallback(err){
        defered.reject(err);
    });
    return deferred.promise;
  }
  /**
   * [Get the profile information of the connected user]
   * @return {User} [Object with the connected user's information]
   */
  const getProfile = () =>{
    var deferred = $q.defer();
    $http.get(apiUrl+'/api/users/me')
    .then(function getProfileSuccessCallback(response){
        deferred.resolve(response.data);
    }, function getProfileErrorCallback(err){
        deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
   * function used to ask the API about the availability of a username
   * @param  {[String]} username [username entered]
   * @return {[boolean]}          [available or not]
   */
 const isUsernameAvailable = (username)=>{
    var deferred =$q.defer();
    $http.post(apiUrl+'/api/users/isAvailable',{username:username})
      .then(function isUsernameAvailableSuccessCallback(response){
        if(response.data.isAvailable){
             deferred.resolve()
           }else{
            deferred.reject();
           }                  
      }, function isUsernameAvailableFailureCallback(err){
          deferred.reject(err);
      });
      return deferred.promise;
 };
/**
   * function used to ask the API about the existence of a username
   * @param  {[String]} username [username entered]
   * @return {[boolean]}          [available or not]
 */
 const isUsernameExist = (username)=>{
    var deferred =$q.defer();
    $http.post(apiUrl+'/api/users/isAvailable',{username:username})
      .then(function isUsernameAvailableSuccessCallback(response){
        if(response.data.isAvailable){
             deferred.reject()
           }else{
            deferred.resolve();
           }                  
      }, function isUsernameAvailableFailureCallback(err){
          deferred.reject(err);
      });
      return deferred.promise;
 };

const getAllHairdressers = () =>{
  var deferred = $q.defer();
  $http.get(apiUrl+'/api/users/hairdressers')
  .then(function getAllHairdressersSuccessCallback (response){
      deferred.resolve(response.data);
  }, function getAllHairdressersFailureCallback(err){
      deferred.reject(err);
  });
  return deferred.promise;
};

const getHairdresserById = (id)=>{
    var deferred = $q.defer();
    $http.get(apiUrl+'/api/users/hairdressers'+'/'+id)
    .then(function getHairdresserByIdSuccessCallback(response){
        deferred.resolve(response.data);
    },function getHairdresserByIdFailureCallback(err){
      deferred.reject(err);
    });
    return deferred.promise;

}

	return {
		login,
		getUserInfo,
		logout,
    register,
    passwordForgot,
    resetPassword,
    updatePassword,
    getProfile,
    isUsernameAvailable,
    isUsernameExist,
    getAllHairdressers,
    getHairdresserById
	};
	
};

authFactory.$inject = ['$http','$window','$q','API','AuthToken'];

export {authFactory};