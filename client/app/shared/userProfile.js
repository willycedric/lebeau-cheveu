const UserProfile = (Auth) => {
	let userProfile = {};
	/**
	 * [description]
	 * @return {[type]} [description]
	 */
	const fetchCustomerProfile = () =>{
		return Auth.getProfile('/api/users/me').then(function fetchUserProfileSuccessCallback(data){
			//Making sure that the userProfile is always empty.
			for (var prop in userProfile){
				if(userProfile.hasOwnProperty(prop)){
					delete userProfile.prop;
				}
			}//end for

			return angular.extend(userProfile,data,{
				$refresh:fetchCustomerProfile,
				$hasRole:(role)=>{
					return (userProfile.role == role)?true:false;
				}
			});
		});
	};
	const fetchHairdresserProfile = () =>{
		return Auth.getProfile('/api/hairdressers/me').then(function fetchUserProfileSuccessCallback(data){
			//Making sure that the userProfile is always empty.
			for (var prop in userProfile){
				if(userProfile.hasOwnProperty(prop)){
					delete userProfile.prop;
				}
			}//end for

			return angular.extend(userProfile,data,{
				$refresh:fetchHairdresserProfile,
				$hasRole:(role)=>{
					return (userProfile.role == role)?true:false;
				}
			});
		});
	};

	return {
		fetchCustomerProfile,
		fetchHairdresserProfile
	};
};

UserProfile.$inject=['Auth'];

export {UserProfile};