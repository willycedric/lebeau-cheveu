class HairdresserController {
  constructor(AuthToken,Auth,Access,API,$log,$states,hairdresserMAnager,$window) {
  	// hairdressers account informations
  	var self = this;
  	self.hairdresser={};
    this.$window = $window;
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
    /**
   * [goToBooking description]
   * @return {[type]} [description]
   */
  goToBooking(){
    this.$window.location.href="#/hairdresser/booking";
  }

  /**
   * [goToMessage description]
   * @return {[type]} [description]
   */
  goToMessage(){
    this.$window.location.href="#/hairdressermessage";
  }
  /**
   * [goToPicture description]
   * @return {[type]} [description]
   */
  goToPicture(){
    this.$window.location.href="#/hairdresser/picture";
  }
} 

HairdresserController.$inject =['AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager','$window'];
export {HairdresserController};
