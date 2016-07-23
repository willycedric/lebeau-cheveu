class ProfileController {
  constructor($window,Auth,$state) {
  	
    this.loggedUser ={};

    if($window.sessionStorage['user']){
    	//sessionStorage['user'] returns a string, we need to use JSON.parse to convert it into an object
    	this.loggedUser= JSON.parse($window.sessionStorage["user"]).user;
    }else{
    	console.error("no value stored in the session object");
    }

    this.logout = (user) =>{
    		Auth.logout();
    		$state.go('home',{},{location:true});
    };
    

};//end constructor;
}
ProfileController.$inject =['$window','Auth','$state'];
export {ProfileController};


