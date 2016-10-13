class ModalInstanceCtrl {
  constructor($uibModalInstance,$log,$http,API,$window,$q,Auth,$state,$rootScope,$scope) {
    this.message = "Checking double binding dsdsdsdsdsdsds";
      $log.debug('Hello from the sub controller');
    var self = this;
     
      self.ok = function () {
        $log.debug('inside the ok');
       // $uibModalInstance.close(this.selected.item);
      };

      self.cancel = function () {
        //$log.debug('inside the cancel');
        //$uibModalInstance.dismiss('cancel');
      };
      self.launchLoginForm = function(){
      
        $log.debug('dismmis the form');
        $uibModalInstance.close('cancel');
      };


    
    //facebook authentication route
    self.facebookUrl = `${API.dev.homeUrl}`+'/api/users/auth/facebook';
    //toggle the display of the registration successfull message
    self.isSuccessfullRegistration=false;
    //toggle the display of the connexion successfull message
    self.isSuccessfullLogin =false;
    $rootScope.$on('successfullRegistration',function(evt,isSuccessfullRegistration){
      $log.debug('From loginController ','Message is received');
      if(isSuccessfullRegistration){
        self.isSuccessfullRegistration=true;
      }
    });
    
    /**
     * [Allow user to login with local credentials]
     * @param  {[type]} data [User's required information for login]
     * @return {[type]}      [Form object used for validation purpose]
     */
   self.logCustomer = (data,customerLoginForm)=>{
      $log.debug('User data ', JSON.stringify(data));
      //The form must be valid in order to be send to the API
      if(customerLoginForm.$valid){       
          Auth.login(`${API.dev.customerRoute}`+'/me',data.username,data.password)
              .then(function loginControllerSuccess(data){
                  $rootScope.$broadcast('connectionStatechanged',{data:data});
                   self.launchLoginForm();
                  //$state.go('home',null,{reload:true});   
              },function loginControllerError(err){
                  //console.error(err);
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
      $log.debug('User data ', JSON.stringify(data));
      //The form must be valid in order to be send to the API
      if(hairdresserLoginForm.$valid){
              Auth.login(`${API.dev.hairdresserRoute}`+'/me',data.username,data.password)
              .then(function loginControllerSuccess(data){
                $log.debug('From the loginControllerSuccess ',data);
                  $rootScope.$broadcast('connectionStatechanged',{data:data});
                   $uibModalInstance.close('cancel');
                  //$state.go('home',null,{reload:true});   
              },function loginControllerError(err){
                  //console.error(err);
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
            $log.debug(JSON.stringify(user));
            if(registerForm.$valid){ 
              if(user.role == 2){ //customers registration
                Auth.register(`${API.dev.customerRoute}`,user)
                      .then(function registerSuccessCallback(response){
                          if(response.status===200){
                            console.log('User is successfully registered');
                          }
                      },function registerFailureCallback(err){
                          //console.error(err);
                      }); 
              }else{ //hairdressers registration
                Auth.register(`${API.dev.hairdresserRoute}`,user)
                      .then(function registerSuccessCallback(response){
                          if(response.status===200){
                            console.log('User is successfully registered');
                          }
                      },function registerFailureCallback(err){
                          //console.error(err);
                      }); 
              }
            }//end if
            
    };

    /**
     * Redirect user to the forgotten password view
     * @return {[type]} [description]
     */
    self.passwordForgot = () =>{
        $state.go('forgot');
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
          //$log.debug('clicked on the connexion button');
          //$modalStack.dismissAll('cancel');
          //$uibModalInstance.close('all');
          
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
      $log.debug('modalCtrl ',formName);
        if(formName ==="customer" && self.isCustomerFormDisplayed ){
              self.isCustomerFormDisplayed = true;
        }else if (formName ==="hairdresser" && !self.isCustomerFormDisplayed){
          self.isCustomerFormDisplayed =false;
        }else{
           self.isCustomerFormDisplayed=!self.isCustomerFormDisplayed;
         }     
    };
   
  }//End constructor 
}
ModalInstanceCtrl.$inject = ['$uibModalInstance','$log','$http','API','$window','$q','Auth','$state','$rootScope','$scope'];
export {ModalInstanceCtrl};
