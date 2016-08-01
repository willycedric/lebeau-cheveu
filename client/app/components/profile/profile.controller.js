class ProfileController {
  constructor($window,Auth,$state,API,$rootScope) {
  	
    this.loggedUser ={};

    if($window.sessionStorage['user']){
    	//sessionStorage['user'] returns a string, we need to use JSON.parse to convert it into an object
    	this.loggedUser= JSON.parse($window.sessionStorage["user"]).user;
    }

    this.logout = (user) =>{
    		Auth.logout()
            .then(function logoutControllerSuccessCallback(response){   
                $rootScope.$broadcast('connectionStatechanged',null);           
                $window.location.href=`${API.home}`;
            },function logoutControllerErrorCallback(err){
                    console.error(err);
            });
    };
    

};//end constructor;
}
ProfileController.$inject =['$window','Auth','$state','API','$rootScope'];
export {ProfileController};


