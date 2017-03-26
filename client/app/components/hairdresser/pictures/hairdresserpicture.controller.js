class HairdresserpictureController {
	  constructor(AuthToken,Auth,Access,API,$log,$state,hairdresserMAnager,$q,pictures) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.$q=$q;
	  	self.hairdresser={};
	  	
	  	
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	    if(token){
	        this.username= AuthToken.parseToken(token).name;
	    }

	    var deserialize = (data)=>{
          var defered = self.$q.defer();
          defered.resolve(data.hairdresser);
          return defered.promise;
        };

	    var init = (data)=>{
	      deserialize(data)
	      .then(function HairdresserControllerGetProfileSuccessCallback (response){
	     	 self.hairdresser= response;
	          self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	      }, function HairdresserControllerGetProfileErrorCallback(err){

	      });
	    };

	    init(pictures);

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
HairdresserpictureController.$inject =['AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager','$q','pictures'];

export {HairdresserpictureController};


