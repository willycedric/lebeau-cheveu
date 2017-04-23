class ModalInstanceCtrl {
  constructor($uibModal,$uibModalStack,$uibModalInstance,$log,$http,API,$window,$q,Auth,$state,$rootScope,$scope,ModalFactory, $location,SOCIAL,utility, security) {

    //facebook authentication route
    this.facebookUrl = `${API.dev.homeUrl}`+'/api/users/auth/facebook';
    this.ModalFactory = ModalFactory;
    this.utility = utility;
    this.security = security;
    this.$location = $location;
    this.SOCIAL = SOCIAL;
    this.$state =$state;
    this.$uibModalStack=$uibModalStack;
    this.$window = $window;
    /**
     * Function used to redirect the user to the facebook login Oauth provider
     * @return {[type]} [description]
     */
    this.goToFacebookLogin = () =>{
      $window.location.href=this.facebookUrl; //redirectiong to facebook
      //$log.debug('ModalCtrl ','redirectiong to facebook Oauth');
    };
    //toggle the display of the registration successfull message
    this.isSuccessfullRegistration=false;
    //toggle the display of the connexion successfull message
    this.isSuccessfullLogin =false;
    $rootScope.$on('successfullRegistration',function(evt,isSuccessfullRegistration){
      //$log.debug('From loginController ','Message is received');
      if(isSuccessfullRegistration){
        this.isSuccessfullRegistration=true;
        this.displayInformationModal();
      }
    });
    
    /**
     * [Allow user to login with local credentials]
     * @param  {[type]} data [User's required information for login]
     * @return {[type]}      [Form object used for validation purpose]
     */
   this.logCustomer = (data,customerLoginForm)=>{
      this.displayLoading('Login in progress'); //Display the spining modal
      //$log.debug('User data ', JSON.stringify(data));
      //The form must be valid in order to be send to the API
      if(customerLoginForm.$valid){       
          Auth.login(`${API.dev.customerRoute}`+'/me',data.username,data.password)
              .then( (data)=>{ 
                  console.log(' data ', data);
                  $rootScope.$broadcast('connectionStatechanged',{data:data});
                   this.lauchLoginForm();                
              }, (err)=>{
                if(parseInt(err.status) === 401){
                  this.displayWrongCredentialModal();
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
    this.logHairdresser = (data,hairdresserLoginForm)=>{      
      //The form must be valid in order to be send to the API
      if(hairdresserLoginForm.$valid){
              this.displayLoading('Login in progress'); //Display the spining modal
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
     var signupSuccess = (data)=>{
      if(data.success){
        //account/user created, redirect...
         this.$uibModalStack.dismissAll('closing');   
        var url = data.defaultReturnUrl || '/';
        return $location.path(url);
      }else{
        //error due to server side validation
        $scope.errfor = data.errfor;
        angular.forEach(data.errfor, function(err, field){
          $scope.signupForm[field].$setValidity('server', false);
        });
      }
    };
    var signupError = ()=>{
      $scope.alerts.push({
        type: 'danger',
        msg: 'Error creating account, Please try again'
      });
    };
    /**
     * Allow user to register an account
     * @param  {[type]} user         [Contains user's required information to create an account]
     * @param  {[type]} registerForm [Form object used for validation purpose]
     * 
     */
    
    this.registerNewAccount = (user,registerForm)=>{
      // this.displayLoading('Registration in progress');
        if(registerForm.$valid){ 
             this.security.signup(user).then(signupSuccess, signupError);
             //remove the spining modal 
                          

        }
    }
    /**
     * [description]
     * @param  {[type]} role [1 for hairdresser and 2 for customer, user to route password reset form to the correct model]
     */
    this.passwordForgot = (role) =>{
        $state.go('forgot',{role:role});
        $uibModalStack.dismissAll('closing');
    };

    /**
     * [Redirect the user to the login view]
     * 
     */
    this.goToLoginView = () =>{
      $state.go('login',null,{reload:true});
    }

    //Control to dismiss the modal 
     this.lauchLoginForm = () => {
          $uibModalInstance.dismiss('cancel');          
    };

    this.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    this.isLoginFormDisplayed = true;
    this.isCustomerFormDisplayed =true;

    this.toggleDisplayedForm = ()=>{
      this.isLoginFormDisplayed =!this.isLoginFormDisplayed;
    };

    this.toggleDisplayedUserForm = (formName) =>{
      //$log.debug('modalCtrl ',formName);
        if(formName ==="customer" && this.isCustomerFormDisplayed ){
              this.isCustomerFormDisplayed = true;
        }else if (formName ==="hairdresser" && !this.isCustomerFormDisplayed){
          this.isCustomerFormDisplayed =false;
        }else{
           this.isCustomerFormDisplayed=!this.isCustomerFormDisplayed;
         }     
    };
    /**
     * [description]
     * @return {[type]} [description]
     */
     this.displayLoading = (message)=>{
       var self= this;
       self.ModalFactory.trigger(self,'loading.html','custom', function($uibModalInstance, topController){
         this.message = message;
         this.gif = "http://res.cloudinary.com/hgtagghpz/image/upload/v1476819238/spinning-gif_i5g0jx.gif";
       });
     };


    /// New controller definition goes here
    /// model def
    this.user ={};
    this.alerts =[];
    this.errfor =[]
    this.social = angular.equals({}, this.SOCIAL)?null:this.SOCIAL;

    //method def
    this.hasError = this.utility.hasError;
    this.showError = this.utility.showError;
    this.canSave = this.utility.canSave;

    this.closeAlert =(ind)=>{
      this.alerts.splice(ind,1);
    };

    this.submit = ()=>{
      this.alerts = [];
      this.security.login(this.user.username, this.user.password)
      .then((data)=>{
        var self =this;
        if(data.success){
        //account/user created, redirect...
        var url = data.defaultReturnUrl || '/';
         $uibModalStack.dismissAll('closing');
        return self.$location.path(url);
        }else{
          //error due to server side validation
          self.errfor = data.errfor;
          angular.forEach(data.errfor, function(err, field){
            self.loginForm[field].$setValidity('server', false);
          });
          angular.forEach(data.errors, function(err, index){
            self.alerts.push({
              type: 'danger',
              msg: err
            });
          });
        }
      },
      ()=>{
          var self = this;
        self.alerts.push({
          type: 'danger',
          msg: 'Error logging you in, Please try again'
        });
      });
    };
   
  }//End constructor 

  /**
   * 
   */
  loginSuccess(data)
  {
    var self=this;
      if(data.success){
        //account/user created, redirect...
        var url = data.defaultReturnUrl || '/';
        return this.$location.path(url);
      }else{
        //error due to server side validation
        self.errfor = data.errfor;
        angular.forEach(data.errfor, function(err, field){
          self.loginForm[field].$setValidity('server', false);
        });
        angular.forEach(data.errors, function(err, index){
          self.alerts.push({
            type: 'danger',
            msg: err
          });
        });
      }
    }
    /**
     * 
     */
    loginError()
    {
      var self = this;
      self.alerts.push({
        type: 'danger',
        msg: 'Error logging you in, Please try again'
      });
    }

  /**
   * [displayInformationModal description]
   * @return {[type]} [description]
   */
  displayInformationModal(){
      var self = this;
      this.ModalFactory.trigger(this,'registration-information.html','custom',function($uibModalInstance,topController){
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
    this.ModalFactory.trigger(this,'wrong-credentials.html','custom', function($uibModalInstance, topController){
      this.message = 'Votre nom d\'utilisateur et/ou votre mot de passe est incorrect. Veuillez recommencer avec des identifiants correctes';
      this.ok = ()=>{
        $uibModalInstance.close('ok');
      };
    })
  }
}
ModalInstanceCtrl.$inject = ['$uibModal','$uibModalStack','$uibModalInstance','$log','$http','API','$window','$q','Auth','$state','$rootScope','$scope','ModalFactory','$location','SOCIAL','utility','security'];
export {ModalInstanceCtrl};
