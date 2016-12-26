class ModalInstanceCtrl {
  constructor($uibModal,$uibModalStack,$uibModalInstance,$log,$http,API,$window,$q,Auth,$state,$rootScope,$scope,ModalFactory) {
    var self = this;   
    //facebook authentication route
    self.facebookUrl = `${API.dev.homeUrl}`+'/api/users/auth/facebook';
    self.ModalFactory = ModalFactory;
    /**
     * Function used to redirect the user to the facebook login Oauth provider
     * @return {[type]} [description]
     */
    self.goToFacebookLogin = () =>{
      $window.location.href=self.facebookUrl; //redirectiong to facebook
      //$log.debug('ModalCtrl ','redirectiong to facebook Oauth');
    };
    //toggle the display of the registration successfull message
    self.isSuccessfullRegistration=false;
    //toggle the display of the connexion successfull message
    self.isSuccessfullLogin =false;
    $rootScope.$on('successfullRegistration',function(evt,isSuccessfullRegistration){
      //$log.debug('From loginController ','Message is received');
      if(isSuccessfullRegistration){
        self.isSuccessfullRegistration=true;
        self.displayInformationModal();
      }
    });
    
    /**
     * [Allow user to login with local credentials]
     * @param  {[type]} data [User's required information for login]
     * @return {[type]}      [Form object used for validation purpose]
     */
   self.logCustomer = (data,customerLoginForm)=>{
      self.displayLoading('Login in progress'); //Display the spining modal
      //$log.debug('User data ', JSON.stringify(data));
      //The form must be valid in order to be send to the API
      if(customerLoginForm.$valid){       
          Auth.login(`${API.dev.customerRoute}`+'/me',data.username,data.password)
              .then( (data)=>{ 
                  console.log(' data ', data);
                  $rootScope.$broadcast('connectionStatechanged',{data:data});
                   self.lauchLoginForm();                
              }, (err)=>{
                if(parseInt(err.status) === 401){
                  self.displayWrongCredentialModal();
                }
              }).finally( (data)=>{   
                console.log(' finally data', data);            
               // if(AuthToken.parseToken())   
                $state.go('customer');
                $uibModalStack.dismissAll('closing'); //remove the spining modal           
              }); 
        
      }else{
        console.error('The login form is not valid');
      }            
    };

    /**
     * Use to login a hairdresser
     * @param  {[type]} data                 [description]
     * @param  {[type]} hairdresserLoginForm [description]
     * @param  {[type]} role                 [description]
     * @return {[type]}                      [description]
     */
    self.logHairdresser = (data,hairdresserLoginForm)=>{      
      //The form must be valid in order to be send to the API
      if(hairdresserLoginForm.$valid){
              self.displayLoading('Login in progress'); //Display the spining modal
              Auth.login(`${API.dev.hairdresserRoute}`+'/me',data.username,data.password)
              .then((data)=>{
                //$log.debug('From the loginControllerSuccess ',data);
                  $rootScope.$broadcast('connectionStatechanged',{data:data});
                   $uibModalInstance.close('cancel');
                  //$state.go('home',null,{reload:true});   
              }).finally(()=>{
                $state.go('hairdresser');
                 $uibModalStack.dismissAll('closing'); //remove the spining modal
              });         
      }else{
        console.error('The login form is not valid');
      }            
    };
    /**
     * Allow user to register an account
     * @param  {[type]} user         [Contains user's required information to create an account]
     * @param  {[type]} registerForm [Form object used for validation purpose]
     * 
     */
    self.registerNewAccount = (user, registerForm)=>{
           
            if(registerForm.$valid){ 
              if(user.role == 2){ //customers registration
                self.displayLoading('Registration in progress');
                Auth.register(`${API.dev.customerRoute}`,user)
                      .then(function registerSuccessCallback(response){
                          if(response.status===200){
                            //$log.log('User is successfully registered');
                          }
                      },function registerFailureCallback(err){
                          //console.error(err);
                      }).finally(function(){
                         $uibModalStack.dismissAll('closing'); //remove the spining modal 
                      }); 
              }else{ //hairdressers registration
                self.displayLoading('Registration in progress');
                Auth.register(`${API.dev.hairdresserRoute}`,user)
                      .then(function registerSuccessCallback(response){
                          if(response.status===200){
                            //$log.log('User is successfully registered');
                          }
                      },function registerFailureCallback(err){
                          //console.error(err);
                      }).finally(function(){
                         $uibModalStack.dismissAll('closing'); //remove the spining modal 
                      }); 
              }
            }//end if
            
    };

    /**
     * [description]
     * @param  {[type]} role [1 for hairdresser and 2 for customer, user to route password reset form to the correct model]
     */
    self.passwordForgot = (role) =>{
        $state.go('forgot',{role:role});
        $uibModalStack.dismissAll('closing');
    };

    /**
     * [Redirect the user to the login view]
     * 
     */
    self.goToLoginView = () =>{
      $state.go('login',null,{reload:true});
    }

    //Control to dismiss the modal 
     self.lauchLoginForm = () => {
          $uibModalInstance.dismiss('cancel');          
    };

    self.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    self.isLoginFormDisplayed = true;
    self.isCustomerFormDisplayed =true;

    self.toggleDisplayedForm = ()=>{
      self.isLoginFormDisplayed =!self.isLoginFormDisplayed;
    };

    self.toggleDisplayedUserForm = (formName) =>{
      //$log.debug('modalCtrl ',formName);
        if(formName ==="customer" && self.isCustomerFormDisplayed ){
              self.isCustomerFormDisplayed = true;
        }else if (formName ==="hairdresser" && !self.isCustomerFormDisplayed){
          self.isCustomerFormDisplayed =false;
        }else{
           self.isCustomerFormDisplayed=!self.isCustomerFormDisplayed;
         }     
    };
    /**
     * [description]
     * @return {[type]} [description]
     */
    self.displayLoading = (message)=>{              
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'loading.html',
                  controller:function($uibModalInstance,message){
                     this.message = message;
                     this.gif="http://res.cloudinary.com/hgtagghpz/image/upload/v1476819238/spinning-gif_i5g0jx.gif";
                  },
                  controllerAs: '$ctrl',
                  size: 'sm',
                  resolve: {
                    message: function () {
                      return  message;
                    }
                  }
                });
        };
   
  }//End constructor 

  /**
   * [displayInformationModal description]
   * @return {[type]} [description]
   */
  displayInformationModal(){
      var self = this;
      self.ModalFactory.trigger(self,'registration-information.html',function($uibModalInstance,topController){
          this.message ='Votre compte vient \'être créé avec succès. \nVeuillez vous connecter à l\'adresse mail que vous avez fourni lors de votre inscription pour activer votre compte ';
          this.ok = ()=>{
              $uibModalInstance.close('OK');
          }
      });
  }

  /**
   * [displayWrongCredentialModal description]
   * @return {[type]} [description]
   */
  displayWrongCredentialModal(){
    var self = this;
    self.ModalFactory.trigger(self,'wrong-credentials.html', function($uibModalInstance, topController){
      this.message = 'Votre nom d\'utilisateur et/ou votre mot de passe est incorrect. Veuillez recommencer avec des identifiants correctes';
      this.ok = ()=>{
        $uibModalInstance.close('ok');
      };
    })
  }
}
ModalInstanceCtrl.$inject = ['$uibModal','$uibModalStack','$uibModalInstance','$log','$http','API','$window','$q','Auth','$state','$rootScope','$scope','ModalFactory'];
export {ModalInstanceCtrl};
