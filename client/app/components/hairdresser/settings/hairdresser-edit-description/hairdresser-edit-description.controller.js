
class HairdresserdescriptionController {
  constructor(API,$log,$location,Auth, hairdresserResource, $stateParams, AuthToken) {
        var self=this;	 		 	 
		 self.$location=$location;
		 self.Auth = Auth;	
		 self.API= API; 
		self.hairdresserResource = hairdresserResource;
		self.$stateParams = $stateParams;
		self.AuthToken = AuthToken;

		if(!!!$stateParams.description){
			self.hairdresserCurrentDescription = self.AuthToken.getObj('description');
		}else{
			self.hairdresserCurrentDescription = $stateParams.description;
			self.AuthToken.saveObj('description',self.hairdresserCurrentDescription);
		}
		
 	 }
	/**
	 * [description]
	 * @param  {[type]} hairdresser [description]
	 * @return {[type]}             [description]
	 */
	updateHairdresserDescription(description){	
		
		// var self = this;	
		// self.Auth.updateHaidresserProfile(`${self.API.dev.hairdresserRoute}`+'/update/description',description)	 
		// .finally(()=>{		
		// 	self.goBackToHairdresserAccount()			
		// })
		var self = this;	
		self.hairdresserResource.updateHairdresserDescription({description})	 
		.finally(()=>{		
			self.goBackToHairdresserAccount()			
		});
	};	   


  	/**
	 * Redirect to hairdresser Account
	 */		
  	goBackToHairdresserAccount(){
		var self=this;
		self.AuthToken.erase('description');
		self.$location.path('/hairdresser/account');
	}
}//end class
HairdresserdescriptionController.$inject =['API','$log','$location','Auth','hairdresserResource', '$stateParams', 'AuthToken'];
export {HairdresserdescriptionController};