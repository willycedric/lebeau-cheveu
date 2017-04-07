class HairdresserController {
  constructor($scope,AuthToken,Auth,Access,API,$log,$states,hairdresserMAnager,$window,$q,summaries) {
  	// hairdressers account informations
  	var self = this;
  	self.hairdresser={};
    self.$window = $window;
    self.$q = $q;
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
          $scope.hairdresser= response;
          $scope.profile_picture=$scope.hairdresser.profile_picture;
          //$scope.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber($scope.hairdresser.appointments);
      }, function HairdresserControllerGetProfileErrorCallback(err){

      });
    };

    init(summaries)

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

HairdresserController.$inject =['$scope','AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager','$window','$q','summaries'];
export {HairdresserController};
