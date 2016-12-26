class AccountactivationController {
  constructor(Auth,$stateParams,$log) {
	    this.user={};
	    this.errorMessage=null;
	    this.isSuccess=false;
	    this.isError=false;
	    this.Auth = Auth;
	    this.gif="http://res.cloudinary.com/hgtagghpz/image/upload/v1476819238/spinning-gif_i5g0jx.gif";
	    this.message = "Activation en cours ...";
	    this.$stateParams=$stateParams
	    const  token = $stateParams.token;
	    const role = $stateParams.role;

	    //In case of an incoming query with a token check if the token is a reset password token and send this token to the server or define user role
	    if(role){
	      if(parseInt(role) ===2 ){
	        this.user.role = 2;
	      }else if(parseInt(role)===1){
	        this.user.role=1;
	      }       
	    }
	    if(token){
	        this.activateAccount($stateParams.token,this);
	        console.log('token ', token);
	      }  

	      if(this.user){
	        console.log('rolr ',this.user.role);
	      }

   }//End constructor


    /**
     * [Function used to send the reset password's token to the server in order to allow user to redefine 
     * his/her password]
     * @param  {[string]} token [reset token generate by the server]
     */
    activateAccount(token,vm){
    	var self = this;
      if(self.user.role === 2){// in case of customer
          self.Auth.activateAccount('/api/users/activate',token)
          .then(function resetPasswordControllerSuccessCallback(response){
              self.isSuccess = true;
          }, function resetPasswordControllerFailureCallback(err){
              self.isError = false;
          });
    }else if (self.user.role === 1){ // in case of hairdressers
      self.Auth.resetPassword('/api/hairdressers/activate',token)
      .then(function resetPasswordControllerSuccessCallback(response){
          self.isSuccess = true;
      }, function resetPasswordControllerFailureCallback(err){
          self.isError=false;
      });
    }else{
        self.$log.error( " the role ", this.user.role, " is not defined");
    }      
  }

} //end class
AccountactivationController.$inject=['Auth','$stateParams','$log'];
export {AccountactivationController};



