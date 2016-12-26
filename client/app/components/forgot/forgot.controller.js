class ForgotController {
  constructor(Auth,$stateParams,$log,ModalFactory) {
    this.user={};
    this.errorMessage=null;
    this.isUser=false;
    this.isError=false;
    this.Auth = Auth;
    this.$stateParams=$stateParams
    this.ModalFactory=ModalFactory;
    this.confirmationOfMailSent = false;
    this.message = 'Veuillez vous connecter à l\'adresse mail que vous avez indiquée lors de votre inscription à fin de  modifier votre mot de passe.';
    var token = $stateParams.token;
    var role = $stateParams.role;

    //In case of an incoming query with a token check if the token is a reset password token and send this token to the server or define user role
    if(role){
      if(parseInt(role) ===2 ){
        this.user.role = 2;
      }else if(parseInt(role)===1){
        this.user.role=1;
      }       
    }
    if(token){
        this.resetPassword($stateParams.token,this);
      }

   }//End constructor


  	/**
     * [Function used to sent a reset password request to the server]
     * @param  {[user.email]} user.email [user's email]
     */
    passwordReset(user){
      var self=this;
      if(this.user.role === 2){ // in case of customer        
        this.Auth.passwordForgot('/api/users/forgot',user.username)
        .then( function forgotControllerSuccessCallbalck(response){
            console.log(response)
             //self.displayForgotConfirmationModal();
             self.confirmationOfMailSent = true;
        }, function forgotControllerErrorCallbalck(err){
          if(parseInt(err.status) === 404){
            self.confirmationOfMailSent = true; // prevent user with bad itention to know that the username their enter is not available
          }
        });
      }else if(this.user.role ===1){//in case of a hairdresser
        this.Auth.passwordForgot('/api/hairdressers/forgot',user.username)
        .then( function forgotControllerSuccessCallbalck(response){
            console.log(response)
            // self.displayForgotConfirmationModal();
            self.confirmationOfMailSent=true;
        }, function forgotControllerErrorCallbalck(err){
          if(parseInt(err.status) === 404){
            self.confirmationOfMailSent = true; // prevent user with bad itention to know that the username their enter is not available
          }
        });
      }else{
        this.$log.error(" the role ", this.user.role," is not defined.");
      }
    }

    /**
     * [updatePassword description]
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    updatePassword(user){
      if(this.user.role === 2){ //in case of customer
         if(user.password === user.passwordConfirmation){
         
          user.passwordToken=this.$stateParams.token;
           this.Auth.updatePassword('/api/users/updatePassword',user)
          .then(function updatePasswordControllerSuccessCallback(response){
              console.log(response.data.message);
          },function updatePasswordControllerFailureCallback(err){
              console.error(err);
          });
        }else{
          console.log("password doesn't match");
        }
      }else if(this.user.role ===1){ //in case of hairdresser
           if(user.password === user.passwordConfirmation){
           
            user.passwordToken=this.$stateParams.token;
             this.Auth.updatePassword('/api/hairdressers/updatePassword',user)
            .then(function updatePasswordControllerSuccessCallback(response){
                console.log(response.data.message);
            },function updatePasswordControllerFailureCallback(err){
                console.error(err);
            });
        }else{
          console.log("password doesn't match");
        }
      }else{
        this.$log.error(" the role ", this.user.role," is not defined");
      }
          
    }

    /**
     * [Function used to send the reset password's token to the server in order to allow user to redefine 
     * his/her password]
     * @param  {[string]} token [reset token generate by the server]
     */
    resetPassword(token,vm){
      if(this.user.role === 2){// in case of customer
          this.Auth.resetPassword('/api/users/reset',token)
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
    }else if (this.user.role === 1){ // in case of hairdressers
      this.Auth.resetPassword('/api/hairdressers/reset',token)
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
    }else{
        this.$log.error( " the role ", this.user.role, " is not defined");
    }      
  }

  /**
   * [displayForgotConfirmationModal Function used to display the password registration]
   * @return {[type]} [description]
   */
  displayForgotConfirmationModal() {
    this.ModalFactory.trigger(this,"forgot-information.html", function($uibModalInstance, topController){
      this.message = 'Veuillez vous connecter à l\'adresse mail que vous avez fourni lors de votre inscription pour modifier votre mot de passe.';
      this.ok = ()=>{
        $uibModalInstance.close('OK');
      };
    });
  }
} //end class
ForgotController.$inject=['Auth','$stateParams','$log','ModalFactory'];
export {ForgotController};


