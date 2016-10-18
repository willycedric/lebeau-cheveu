
const AuthToken = ($window,$log) =>{
	/**
   * [Save the token received in each response of the server in the sessionStorage]
   * @param  {[type]} token [token received from the server]
   */
  const saveToken = (token)=>{
    $window.localStorage.setItem('jwtToken',token);
  };

  /**
   * [get the token saved in the sessionStorage]
   * @return {[string]} [token received in the server response and saved in the sessionStorage]
   */
  const getToken = () =>{
    return $window.localStorage['jwtToken'];
  };

  /**
   * [delete the user token on logout]
   */
  const deleteToken = () =>{
  	$window.localStorage.removeItem("jwtToken");
  }
  /**
   * [parse the token receivede from the server in order to obtain user's information]
   * @param  {[string]} token [access token]
   * @return {[object]}       [token payload]
   */
  const parseToken = (token) =>{
    if(token){
      var base64url= token.split('.')[1];
      var base64 = base64url.replace('-','+').replace('_','/');
      return JSON.parse($window.atob(base64));
    }else{
        $log.error('token is not define');
    }
  	
  };
   const isAuthenticated = (token, payload) =>{
   		if(token){
   			return Math.round(new Date().getTime()/1000)<= payload.exp;
   		}else{
   			return false;
   		}
   };
  return {
  	saveToken,
  	getToken,
  	deleteToken,
  	parseToken,
  	isAuthenticated
  };
};
AuthToken.$inject =['$window','$log'];

export {AuthToken};