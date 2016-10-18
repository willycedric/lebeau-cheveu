const AuthInterceptor = (AuthToken,API,$q,$rootScope,$window)=>{
	let apiUrl=`${API.dev.homeUrl}`;
	return {
		/**
		 * [response function of the interceptor, take the token send by the server and  pass it to the AuthToken service]
		 * @param  {[object]} res [server response]
		 * @return {[object]}     [server response]
		 */
		response: function(res){
			if((res.config.url.indexOf(apiUrl+`${API.dev.customerRoute}`) === 0 || res.config.url.indexOf(apiUrl+`${API.dev.hairdresserRoute}`)===0 )&& res.data.token){
				AuthToken.saveToken(res.data.token);
				//redirect the user to the home page after login
				//$window.location.href=`${API.dev.home}`;
			
			}
			if((res.config.url == apiUrl+`${API.dev.customerRoute}`)||(res.config.url == apiUrl+`${API.dev.hairdresserRoute}`) && res.status===200 && res.data.isRegistered){
				//redirect to the home page after successfull registration
				//$window.location.href=`${API.dev.home}`;
				//console.log('From the interceptor ', 'message is about to be broadcast');
				$rootScope.$broadcast('successfullRegistration', {isSuccessfullRegistration:true});
			}else if (res.config.url == apiUrl+'/api/users' && res.status===200 && !res.data.isRegistered){
					console.log('Error during the registration process');	
			}
			return res;
		},
		/**
		 * [request function of the interceptor which take in argument the request config object and add it the authorization header
		 * which will be used in each request]
		 * @param  {[object]} config [request configuration object]
		 * @return {[object]}        [request configuration object with the authorization header]
		 */
		request:function(config){
			var token = AuthToken.getToken();
			if((config.url.indexOf(apiUrl+`${API.dev.customerRoute}`) === 0 || config.url.indexOf(apiUrl+`${API.dev.hairdresserRoute}`)===0 ) && token){
				config.headers.Authorization='JWT '+token;
			}
			return config;
		},
		/**
		 * [responseError send the appropriate event in case of error status code in the response]
		 * @param  {[object]} rejection [response rejection object]
		 * @return {[object]}           [response rejection object]
		 */
		responseError:function(rejection){
			switch(rejection.status){
				case 401:
					$rootScope.$broadcast('onUauthorizedRequestEvent',{code:401});
					$window.location.href=`${API.dev.error}`;
				break;
				case 301:

					$rootScope.$broadcast('alreadyRegistered',{code:301});
					console.log('The event is fired');
					$window.location.href=`${API.dev.error}`;
				break;
				case 400:
					$rootScope.$broadcast('onBadRequestEvent',{code:400});
					$window.location.href=`${API.dev.error}`;
				break;
				case 403:
					$rootScope.$broadcast('onForbidenRequestEvent',{code:403});
					$window.location.href=`${API.dev.error}`;
				break;
				case 404:
					$rootScope.$broadcast('onContentNotFoudEvent',{code:404});
					$window.location.href=`${API.dev.error}`;
				break;
				case 500:
					$rootScope.$broadcast('onInternalServerErrorEvent',{code:500});
					$window.location.href=`${API.dev.error}`;
				break;
				default:
					$window.location.href=`${API.dev.error}`;
				break;
			}
			return $q.reject(rejection);
		}
	};

};

AuthInterceptor.$inject=['AuthToken','API','$q','$rootScope','$window'];

export {AuthInterceptor};