const UserProfile = (Auth) => {
	let userProfile = {};

	const fetchUserProfile = () =>{
		return Auth.getProfile().then(function fetchUserProfileSuccessCallback(data){
			//Making sure that the userProfile is always empty.
			for (var prop in userProfile){
				if(userProfile.hasOwnProperty(prop)){
					delete userProfile.prop;
				}
			}//end for

			return angular.extend(userProfile,data,{
				$refresh:fetchUserProfile,
				$hasRole:(role)=>{
					return (userProfile.role == role)?true:false;
				}
			});
		});
	};
	return {
		fetchUserProfile
	};
};

UserProfile.$inject=['Auth'];

export {UserProfile};