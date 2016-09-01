class LoginController {
  constructor($http,API,$window,$q,Auth,$state,$rootScope) {
    var self = this;

    //facebook authentication route
    self.facebookUrl = 'http://'+`${API.dev.homeUrl}`+'/api/users/auth/facebook';
    
    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
   self.login = (data,loginForm)=>{
      console.log('User data ', JSON.stringify(data));
      if(loginForm.$valid){
        console.log('email ', loginForm.email);
        $state.go('login',null,{reload:true});
        Auth.login(data.email,data.password)
              .then(function loginControllerSuccess(data){
                  $rootScope.$broadcast('connectionStatechanged',{data:data.user});
                  //$state.go('home',null,{reload:true});   
              },function loginControllerError(err){
                  console.error(err);
              }); 
      }else{
        console.error('The login form is not valid');
      }    	       
    };   
    self.register = (user, registerForm)=>{
            if(registerForm.$valid){ 
                Auth.register(user)
                      .then(function registerSuccessCallback(response){
                          console.log('user successfully registered');
                      },function registerFailureCallback(err){
                          console.error(err);
                      }); //End Auth factory
            }
            
    };

    self.passwordForgot = () =>{
        $state.go('forgot');
    };

    self.goToLogin = () =>{
      $state.go('login',null,{reload:true});
    }

   

  }//End constructor

}

LoginController.$inject = ['$http','API','$window','$q','Auth','$state','$rootScope'];

export {LoginController};


