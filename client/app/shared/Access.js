const Access = (UserProfile,$q) =>{
	let access = {
		OK:200,
		// "we don't know who you are, so we can't say if you're authorized to access
	    // this resource or not yet, please sign in first"
	    UNAUTHORIZED: 401,

	    // "we know who you are, and your profile does not allow you to access this resource"
	    FORBIDDEN: 403,
       isHairdresser: function (role) {
       				var deferred = $q.defer();
			       return UserProfile.fetchHairdresserProfile().then(function (userProfile) {
			        if (userProfile.$hasRole(role)) {
			           deferred.resolve(access.OK);
			        }  else {
			            deferred.reject(access.UNAUTHORIZED);
			        }
			        return deferred.promise;
			      });
			       //return deferred.promise;
			    },
	    isCustomer :function (role) {
       				var deferred = $q.defer();
			       return UserProfile.fetchCustomerProfile().then(function (userProfile) {
			        if (userProfile.$hasRole(role)) {
			           deferred.resolve(access.OK);
			        }  else {
			            deferred.reject(access.UNAUTHORIZED);
			        }
			        return deferred.promise;
			      });
			       //return deferred.promise;
			    }
	};
	return access;
};

Access.$inject=["UserProfile","$q"];
export{Access};