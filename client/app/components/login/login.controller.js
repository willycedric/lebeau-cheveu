class LoginController {
  constructor($http,API,$window,$q,Auth,$state,$rootScope) {
    var self = this;

    //facebook authentication route
    self.facebookUrl = `${API.dev.homeUrl}`+'/api/users/auth/facebook';
    
    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
   self.login = (data)=>{
    	Auth.login(data.email,data.password)
            .then(function loginControllerSuccess(data){
                $rootScope.$broadcast('connectionStatechanged',{data:data.user});
                //$state.go('home',null,{reload:true});   
            },function loginControllerError(err){
                console.error(err);
            });        
    };
   
    self.register = (user)=>{
            console.log(JSON.stringify(user));
            Auth.register(user)
            .then(function registerSuccessCallback(response){
                console.log('user successfully registered');
            },function registerFailureCallback(err){
                console.error(err);
            });
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


