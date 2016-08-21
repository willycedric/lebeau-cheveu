const AuthInterceptor = (AuthToken,API,$q,$rootScope,$window)=>{
	let apiUrl=`${API.dev.homeUrl}`;
	return {
		/**
		 * [response function of the interceptor, take the token send by the server and  pass it to the AuthToken service]
		 * @param  {[object]} res [server response]
		 * @return {[object]}     [server response]
		 */
		response: function(res){
			if(res.config.url.indexOf(apiUrl+'/api/users') === 0 && res.data.token){
				AuthToken.saveToken(res.data.token);
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
			if(config.url.indexOf(apiUrl+'/api/users') === 0 && token){
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
					$window.location.href=`${API.error}`;
				break;
				default:
					$window.location.href=`${API.error}`;
				break;
			}
			return $q.reject(rejection);
		}
	};

};

AuthInterceptor.$inject=['AuthToken','API','$q','$rootScope','$window'];

export {AuthInterceptor};