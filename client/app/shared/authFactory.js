const authFactory = ($http, $window,$q,API,AuthToken,$log) =>{
  let userInfo={};
  let apiUrl=`${API.dev.homeUrl}`;
  /**
   * [register a user with valid informations]
   * @param  {[user's object]} user [user'email and password]
   * @return {[http promise]}      [http promise which will be resolved in the user profile controller]
   */
  const register = (route,user)=>{
    return $http.post(apiUrl+route,user);
  }

  /**
   * [login the registered user and saved the jwtToken in the local storage]
   * @param  {[string]} email    [user email]
   * @param  {[string]} password [user password]
   
   */
  const login = (route,username,password) =>{
        var deferred = $q.defer();
        $http.post(apiUrl+route,{username:username,password:password})
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
  const logout = (route) =>{
    var deferred = $q.defer();
    $http({ 
                url:apiUrl+route,
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

  const passwordForgot = (route,username)=>{
    var deferred = $q.defer();
    $http.post(apiUrl+route,{username:username})
            .then(function forgotSuccessCallback(response){
                deferred.resolve(response);
            }, function forgotErrorCallback(err){
              deferred.reject(err);
            });
            return deferred.promise;
  };

  const resetPassword = (route,token) =>{
    var deferred = $q.defer();
    $http.post(apiUrl+route,{token:token})
    .then(function resetPasswordSuccessCallback(response){
        deferred.resolve(response);
    }, function resetPasswordFailureCallback(err){
        deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
   * [Function used to send the token to the backend in order to activate the user account ]
   * @param  {[type]} route [backend  api route]
   * @param  {[type]} token [temporary token]
   * @return {[type]}       [action confirmation boolean]
   */
  const activateAccount = (route, token) =>{
    var deferred = $q.defer();
    $http.post(apiUrl+route,{token:token})
    .then(function resetPasswordSuccessCallback(response){
        deferred.resolve(response.data);
    }, function resetPasswordFailureCallback(err){
        deferred.reject(err);
    });
    return deferred.promise;
  }

  const updatePassword = (route,user)=>{
    console.log(JSON.stringify(user));
    var deferred = $q.defer();
    $http.post(apiUrl+route,{token:user.passwordToken,password:user.password})
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
  const getProfile = (route) =>{
    var deferred = $q.defer();
    $http.get(apiUrl+route)
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
 const isUsernameAvailable = (route,username)=>{
    var deferred =$q.defer();
    $http.post(apiUrl+route,{username:username.value, name:username.name})
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
 const isUsernameExist = (route,username)=>{
  $log.debug(route);
    var deferred =$q.defer();
    $http.post(apiUrl+route,{username:username})
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

const getAllHairdressers = (route,alreadyDisplayed) =>{
  var deferred = $q.defer();
  $http.get(apiUrl+route+'/hairdressers?alreadyDisplayed='+alreadyDisplayed.toString())
  .then(function getAllHairdressersSuccessCallback (response){
      deferred.resolve(response.data);
  }, function getAllHairdressersFailureCallback(err){
      deferred.reject(err);
  });
  return deferred.promise;
};

/**
 * Helper allowing to get the user by his ID 
 * @param  {[type]} route [API Route]
 * @param  {[type]} id    [user Id]
 * @return {[type]}       [description]
 */
const getUserById = (route, id)=>{
    var deferred = $q.defer();
    $http.post(apiUrl+route+'/getUserById',{id:id})
    .then(function getUserByIdSucccessCallback(response){
        deferred.resolve(response.data);
    },function getUserByIdFailureCallback(err){
      deferred.reject(err);
    });
    return deferred.promise;

};

/**
 * Function used to update a customer account
 * @param  {[type]} route [description]
 * @param  {[type]} user  [description]
 * @return {[type]}       [description]
 */
  const updateUserProfile = (route,user)=>{
    var deferred =$q.defer();
    $http.put(apiUrl+route+'/'+user._id,{user:user})
    .then(function updateUserProfileSuccessCallback(response){
        deferred.resolve(response.data);
    }, function updateUserProfileErrorCallback (err){
      deferred.reject(new Error('Error during user update '+err));
    });
    return deferred.promise;
  }
  /**
 * Function used to update a customer account
 * @param  {[type]} route [description]
 * @param  {[type]} user  [description]
 * @return {[type]}       [description]
 */
  const updateProfile = (route,user)=>{
    var deferred =$q.defer();
    $http.put(apiUrl+route+'/me',{user:user})
    .then(function updateUserProfileSuccessCallback(response){
        deferred.resolve(response.data);
    }, function updateUserProfileErrorCallback (err){
      deferred.reject(new Error('Error during user update '+err));
    });
    return deferred.promise;
  }

const getHairdresserById = (id)=>{
    var deferred = $q.defer();
    $http.get(apiUrl+'/api/hairdressers'+'/'+id)
    .then(function getHairdresserByIdSucccessCallback(response){
        deferred.resolve(response.data);
    },function getHairdresserByIdFailureCallback(err){
      deferred.reject(err);
    });
    return deferred.promise;

};

/**
 * get The user profile 
 * @param  {[type]} route [description]
 * @return {[type]}       [description]
 */
const getMe = (route)=>{
    var deferred = $q.defer();
    $http.get(apiUrl+route+'/me')
    .then(function getMeSucccessCallback(response){
        deferred.resolve(response.data);
    },function getMeFailureCallback(err){
      deferred.reject(new Error('Error getMe (err) =>'+err));
    });
    return deferred.promise;
};

const testGetProfile = (route) =>{
      $log.debug('inside the testGetProfile function');
      var promise = $http({
        method: 'GET',
        url: apiUrl+route
      });
      promise.success(function(data, status, headers, conf) {
        return data;
      });
      return promise;
    };

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
    getUserById,
    getHairdresserById,
    updateUserProfile,
    getMe,
    testGetProfile,
    updateProfile,
    activateAccount
  };
  
};

authFactory.$inject = ['$http','$window','$q','API','AuthToken','$log'];

export {authFactory};