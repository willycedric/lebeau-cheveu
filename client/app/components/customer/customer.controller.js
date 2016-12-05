class CustomerController {
	  constructor(AuthToken,Auth,Access,API) {
	  	this.lastName=null;
	  	this.firstName=null;
	  	this.Auth = Auth;
	  	this.API =API;
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	 	//while the user still connected the token is available from the local storage	
     	//this.refreshCustomerProfile(this,token);        
		Auth.getProfile(`${API.dev.customerRoute}`+'/me')
	      .then((rep)=>{
	          this.customer = rep;
        });
	};//end constructor;
	/**
	 * [getUnreadNotification return the number of unread notification]
	 * @param  {[type]} customer [description]
	 * @return {[type]}          [description]
	 */
	getUnreadCustomerNotification(notifications){
		let count=0;
		angular.forEach(notifications, (notif)=>{
			if(!notif.read){
				count++;
			}
		});
		return count;
	}

	/**[getPendingAppointment Functiona allowing  to get the number of pending appointment]
	 * @param  {[type]} appointments [description]
	 * @return {[type]}              [description]
	 */
	getPendingAppointment(appointments){
		let count=0;
		angular.forEach(appointments, (apt)=>{
			if(apt.appointmentState == 0){
				count++;
			}
		});
		return count;
	}
}
CustomerController.$inject =['AuthToken','Auth','Access','API'];
export {CustomerController};

