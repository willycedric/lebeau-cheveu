class CustomerController {
	  constructor(AuthToken,Auth,Access,API) {
	  	this.lastName=null;
	  	this.firstName=null;
	  	this.Auth = Auth;
	  	this.API =API;
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	 	//while the user still connected the token is available from the local storage	
     	this.refreshCustomerProfile(this,token);        
	};//end constructor;
	/**
	     * Function used to refresh the customer profile's information
	     * @param  {[type]} profile [user profile object]
     */	
	 refreshCustomerProfile (self,token){
	    		if(token){  
	    			this.Auth.getProfile(`${this.API.dev.customerRoute}`+'/me')
		    		.then(function customerControllerGetProfileSuccess (data){		    			
		    			self.lastName= data.lastName;		    			
		    			self.firstName=data.firstName;
		    			self.photoUrl = data.photoUrl;
		    		}, function customerControllerGetProfileFailure(err){
		    			console.error('customerControllerGetProfileFailure ',err);
		    		});
	    		}
    };	
}
CustomerController.$inject =['AuthToken','Auth','Access','API'];
export {CustomerController};

