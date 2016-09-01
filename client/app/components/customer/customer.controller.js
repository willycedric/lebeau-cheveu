class CustomerController {
  constructor(AuthToken,$stateParams,Access) {

	//If a user is connected through the localStretegy, retrieveed the token from the localStorage
 	var token = AuthToken.getToken();
    if(token){
        this.userName= AuthToken.parseToken(token).name;
    } 
};//end constructor;
}
CustomerController.$inject =['AuthToken','$stateParams','Access'];
export {CustomerController};

