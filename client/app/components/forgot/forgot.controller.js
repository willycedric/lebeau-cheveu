class ForgotController {
  constructor(Auth) {
  	
    this.passwordReset =(user)=>{
    	Auth.passwordForgot(user.email)
    	.then( function forgotControllerSuccessCallbalck(response){
    			console.log(response)
    	}, function forgotControllerErrorCallbalck(err){
    		console.error(err);

    	});
    };
  }//End constructor

}
ForgotController.$inject=['Auth'];
export {ForgotController};


