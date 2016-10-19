class HairdresserController {
  constructor(AuthToken,$stateParams,Access) {

	//If a user is connected through the localStretegy, retrieveed the token from the localStorage
 	var token = AuthToken.getToken();
    if(token){
        this.username= AuthToken.parseToken(token).name;
    } 
Access.isHairdresser(1)
.then(function(response){
	console.log('Response ',response);
}, function (reason){
	console.log('Failure ',reason);
});    

};//end constructor;
}
HairdresserController.$inject =['AuthToken','$stateParams','Access'];
export {HairdresserController};



