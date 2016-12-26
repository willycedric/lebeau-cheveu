class CartController {
  constructor(AuthToken,Auth,Access,API,$log,$states,hairdresserMAnager) {
  	// hairdressers account informations
  	var self = this;
  	self.user={};
	//If a user is connected through the localStretegy, retrieveed the token from the localStorage
 	var token = AuthToken.getToken();
    if(token){
        self.username= AuthToken.parseToken(token).name;
        self.role = AuthToken.parseToken(token).role;
        console.log(self.role)
    }

    if( self.role === 1){
    	 Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	    .then( (response)=>{
	    		
	    		self.user= response;
	    		self.greeting = self.user.username;
	        self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.user.appointments);
	    }, (err)=>{
	    	$log.error(err);
	    });
    }else if(self.role === 2){
    	 Auth.getProfile(`${API.dev.customerRoute}`+'/me')
	    .then( (response)=>{
	    		
	    		self.user= response;
	    		self.greeting = self.user.username;
	        self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.user.appointments);
	    }, (err)=>{
	    	$log.error(err);
	    });
    }
   

};//end constructor;
}
CartController.$inject =['AuthToken','Auth','Access','API','$log','$state','hairdresserMAnager'];
export {CartController};




