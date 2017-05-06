class VerificationaccountController {
  constructor($stateParams,$log, accountResource) {  	
   this.user={};
	    this.errorMessage=null;
	    this.isSuccess=false;
	    this.isError=false;
	    this.gif="http://res.cloudinary.com/hgtagghpz/image/upload/v1476819238/spinning-gif_i5g0jx.gif";
	    this.message = "Activation en cours ...";
	    this.$stateParams=$stateParams
	    const  token = $stateParams.token;
      this.accountResource = accountResource; 
	    //In case of an incoming query with a token check if the token is a reset password token and send this token to the server or define user role	   
	    if(token){
	        this.activateAccount($stateParams.token);
	        console.log('token ', token);
      } 

   }//End constructor
    /**
     * [Function used to send the reset password's token to the server in order to allow user to redefine 
     * his/her password]
     * @param  {[string]} token [reset token generate by the server]
     */
    activateAccount(token){
    	var self = this;
      if(true){// in case of customer
          self.accountResource.verifyAccount(token)
          .then(function resetPasswordControllerSuccessCallback(response){
              self.isSuccess = true;
          }, function resetPasswordControllerFailureCallback(err){
              self.isError = false;
          });
    }else{
        self.$log.error( " the role ", this.user.role, " is not defined");
    }      
  }

}
VerificationaccountController.$inject=['$stateParams','$log','accountResource'];

export {VerificationaccountController};


