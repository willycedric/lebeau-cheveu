class HairdresserpictureController {
	  constructor(AuthToken,Auth,Access,API,$log,$state,hairdresserMAnager) {
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
	    		self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	    }, function HairdresserControllerGetProfileErrorCallback(err){

	    });

	};//end constructor;
	
    /**
	 * [getPendingAppointment description]
	 * @param  {[type]} appointments [description]
	 * @return {[type]}              [description]
	 */
	getPendingAppointment(appointments){
		let count=0;
		angular.forEach(appointments, (apt)=>{
			if(apt.appointmentState === -1){
				count++;
			}
		});
		return count;
	}
}
HairdresserpictureController.$inject =['AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager'];

export {HairdresserpictureController};


