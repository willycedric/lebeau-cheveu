class ForgotController {
  constructor(Auth,$stateParams) {
    this.user={};
    this.errorMessage=null;
    this.isUser=false;
    this.isError=false;
  	/**
     * [Function used to sent a reset password request to the server]
     * @param  {[user.email]} user.email [user's email]
     */
    this.passwordReset =(user)=>{
    	Auth.passwordForgot(user.email)
    	.then( function forgotControllerSuccessCallbalck(response){
    			console.log(response)
    	}, function forgotControllerErrorCallbalck(err){
    		console.error(err);

    	});
    };

    this.updatePassword=(user)=>{

      if(user.password === user.passwordConfirmation){
        user.passwordToken=$stateParams.token;
         Auth.updatePassword(user)
        .then(function updatePasswordControllerSuccessCallback(response){
            console.log(response.data.message);
        },function updatePasswordControllerFailureCallback(err){
            console.error(err);
        });
      }else{
        console.log("password doesn't match");
      }     
    };

    /**
     * [Function used to send the reset password's token to the server in order to allow user to redefine 
     * his/her password]
     * @param  {[string]} token [reset token generate by the server]
     */
    this.resetPassword = (token,vm) =>{
      Auth.resetPassword(token)
      .then(function resetPasswordControllerSuccessCallback(response){
          if(response.data.error){
              vm.isError=true;
              vm.errorMessage = response.data.error;
          }else{
              vm.isUser=true;
              vm.user.token = response.data.passwordToken;
          }
      }, function resetPasswordControllerFailureCallback(err){
          console.error(err);
      });
    };

    //In case of an incoming query with a reset password token send this token to the server
    if($stateParams.token){
          this.resetPassword($stateParams.token,this);
    }

  }//End constructor

}
ForgotController.$inject=['Auth','$stateParams'];
export {ForgotController};


