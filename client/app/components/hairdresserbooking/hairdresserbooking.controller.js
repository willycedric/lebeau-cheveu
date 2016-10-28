	class HairdresserbookingController {
	  constructor(AuthToken,Auth,Access,API,$log,$state) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.hairdresser={};
	  	self.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
	  	self.days = [];
        self.times =[];
	  	
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
	HairdresserbookingController.$inject =['AuthToken','Auth','Access','API','$log','$state'];
export {HairdresserbookingController};


