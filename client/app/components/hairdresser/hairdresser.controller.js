class HairdresserController {
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

    /**
     * redirect the hairdresser to the Account view
     * @return {[type]} [description]
     */
    self.goToMyAccount = ()=>{
    	$log.debug('click on the button');
    	$state.go('hairdresser.account');
    };

    /**
     * redirect the hairdresser to the booking view
     * @return {[type]} [description]
     */
    self.goToBooking= () => {
    	$log.debug("hairdresser Booking View");
    	$state.go('hairdresser.booking');
    };

    /**
     * redirect the hairdresser to the logbook view
     * @return {[type]} [description]
     */
    self.goToMyLogbook = () =>{
    	$log.debug("hairdresser Logbook view");
    	$state.go("hairdresser.logbook");
    };

    /**
     * redirect the hairdresser to the galeria view
     * @return {[type]} [description]
     */
    self.goToMyPhoto = () =>{
    	$log.debug("hairdresser Pictures view");
    	$state.go('hairdresser.picture');
    };


Access.isHairdresser(1)
.then(function(response){ 
	console.log('Response ',response);
}, function (reason){
	console.log('Failure ',reason);
});    

};//end constructor;
}
HairdresserController.$inject =['AuthToken','Auth','Access','API','$log','$state'];
export {HairdresserController};



