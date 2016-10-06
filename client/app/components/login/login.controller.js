class LoginController {
  constructor($http,API,$window,$q,Auth,$state,$rootScope,$scope) {
    var self = this;

    //facebook authentication route
    self.facebookUrl = `${API.dev.homeUrl}`+'/api/users/auth/facebook';
    //toggle the display of the registration successfull message
    self.isSuccessfullRegistration=false;
    //toggle the display of the connexion successfull message
    self.isSuccessfullLogin =false;
    $rootScope.$on('successfullRegistration',function(evt,isSuccessfullRegistration){
      console.log('From loginController ','Message is received');
      if(isSuccessfullRegistration){
        self.isSuccessfullRegistration=true;
      }
    });

    /**
     * [Allow user to login with local credentials]
     * @param  {[type]} data [User's required information for login]
     * @return {[type]}      [Form object used for validation purpose]
     */
   self.login = (data,loginForm)=>{
      console.log('User data ', JSON.stringify(data));
      //The form must be valid in order to be send to the API
      if(loginForm.$valid){
        //console.log('email ', loginForm.email);
        //$state.go('login',null,{reload:true});
        Auth.login(data.userName,data.password)
              .then(function loginControllerSuccess(data){
                  $rootScope.$broadcast('connectionStatechanged',{data:data.user});
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
    self.register = (user, registerForm)=>{
            if(registerForm.$valid){ 
                Auth.register(user)
                      .then(function registerSuccessCallback(response){
                          if(response.status===200){
                            console.log('User is successfully registered');
                          }
                      },function registerFailureCallback(err){
                          //console.error(err);
                      }); //End Auth factory
            }
            
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

   

  }//End constructor

}

LoginController.$inject = ['$http','API','$window','$q','Auth','$state','$rootScope','$scope'];

export {LoginController};


