
class HairdresserdescriptionController {
  constructor(API,$log,$location,Auth) {
        var self=this;	 		 	 
		 self.$location=$location;
		 self.Auth = Auth;	
		 self.API= API; 
  } //end constructor  	

	/**
	 * [description]
	 * @param  {[type]} hairdresser [description]
	 * @return {[type]}             [description]
	 */
	updateHairdresserDescription(description){	
		var self = this;	
		self.Auth.updateHaidresserProfile(`${self.API.dev.hairdresserRoute}`+'/update/description',description)	 
		.finally(()=>{		
			self.goBackToHairdresserAccount()			
		})
	};	   

  	/**
	 * Redirect to hairdresser Account
	 */		
  	goBackToHairdresserAccount(){
		var self=this;
		self.$location.path('/hairdresser/account');
	}
}//end class
HairdresserdescriptionController.$inject =['API','$log','$location','Auth'];
export {HairdresserdescriptionController};