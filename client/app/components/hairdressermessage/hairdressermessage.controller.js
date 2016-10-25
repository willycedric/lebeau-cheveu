	class HairdressermessageController {
	  constructor(AuthToken,Auth,Access,API,$log,$state) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.hairdresser={};
	  	
	  	
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	    if(token){
	        this.username= AuthToken.parseToken(token).name;
	    }

	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	    .then(function HairdresserControllerGetProfileSuccessCallback (response){
	    		self.hairdresser= response;
	    }, function HairdresserControllerGetProfileErrorCallback(err){

	    });


	};//end constructor;
	}
	HairdressermessageController.$inject =['AuthToken','Auth','Access','API','$log','$state'];

export {HairdressermessageController};


