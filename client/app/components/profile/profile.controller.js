class ProfileController {
  constructor(AuthToken,$stateParams) {

	//If a user is connected through the localStretegy, retrieveed the token from the localStorage
 	var token = AuthToken.getToken();
    if(token){
        this.userName= AuthToken.parseToken(token).name;
    }    

};//end constructor;
}
ProfileController.$inject =['AuthToken','$stateParams'];
export {ProfileController};


