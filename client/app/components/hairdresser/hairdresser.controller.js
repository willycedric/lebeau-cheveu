class HairdresserController {
  constructor(AuthToken,Auth,Access,API,$log,$states,hairdresserMAnager) {
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
}
HairdresserController.$inject =['AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager'];
export {HairdresserController};
