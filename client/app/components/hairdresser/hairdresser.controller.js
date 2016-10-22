class HairdresserController {
  constructor(AuthToken,Auth,Access,API,$log) {
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
$log.debug("self ",self.username);


Access.isHairdresser(1)
.then(function(response){ 
	console.log('Response ',response);
}, function (reason){
	console.log('Failure ',reason);
});    

};//end constructor;
}
HairdresserController.$inject =['AuthToken','Auth','Access','API','$log'];
export {HairdresserController};



