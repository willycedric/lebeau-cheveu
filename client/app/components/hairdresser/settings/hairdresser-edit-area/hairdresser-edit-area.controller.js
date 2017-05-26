
class HairdresserareaController {
  constructor(API,$log,$location,Auth,$stateParams,$q,$scope,ModalFactory,hairdresserMAnager) {
        var self=this;	 		 	 
		 self.$location=$location;
		 self.Auth = Auth;	
		 self.API= API; 
		 self.$q = $q;
		 self.$stateParams = $stateParams;
		 self.activityArea = self.$stateParams.area;
		 self.$scope =$scope;		 
		 self.ModalFactory  = ModalFactory;
		 self.hairdresserMAnager = hairdresserMAnager;
  } //end constructor  	

	/**
	 * add an activity area to the connected hairdresser
	 * @param {*} location googple maps place object
	 */
	updateCoverZone(location){
		console.log('location',location,this.$scope.address_components);
		var self=this;
		//parse the response returned from the google api
		var init = ()=>{
				var defered = self.$q.defer();
				var data ={};
				if(this.$scope){			
				for (var i in this.$scope.address_components)
				{				
					var component = this.$scope.address_components[i];
					for (var j in component.types) {  // Some types are ["country", "political"]
						switch(component.types[0]){
							case"postal_code":
							data.postal_code = component.long_name;
							break;
							case "administrative_area_level_1":
							data.administrative_level_1 = component.long_name;
							break;
							case "administrative_area_level_2":
								data.administrative_level_2 = component.long_name;
							break;
							case "locality":
								data.locality = component.long_name;
							break;
							case "country":
								data.country = component.long_name;
							break;
							default:
							break;
						}			
					}
					
				}				
				data.location = [this.$scope.longitude, this.$scope.latitude]
				data.longitude=this.$scope.longitude;
				data.latitude = this.$scope.latitude;
				data.formatted_address = this.$scope.formatted_address;				
				defered.resolve(data);
			}else{
				//throw new Error("the scope variable is not available");
				defered.reject(new Error("the scope variable is not available"));
			}
			return defered.promise;
		}
		//send the location information to the backend
		init()
		.then((data)=>{			
			var found = self.validate(self.activityArea,data);
			if(!found){
				self.hairdresserMAnager.updateHairdresserCoverZone(data)
				.then((rep)=>{
					//self.displayConfirmationModal(data.formatted_address+" a été ajoutée à liste de vos zone d'activités.",true);					
					self.goBackToHairdresserAccount();
				},()=>{
					self.displayConfirmationModal("une erreur est survenue pendant la mise à jour de votre profil. Veuillez recommencer ultérieurement",false);
				});
				
			}else{
				self.displayConfirmationModal(data.formatted_address+" ,a déja été ajoutée à liste de vos zone d'activités.",true);
			}			
		},(err)=>{
			throw new Error(err.toString());
		});
		
	}
	
	/**
	 * check if the new activity area is already add by the connected hairdresser.
	 * @param {*list of the activity area } collection 
	 * @param {* new activity area} data 
	 */
	validate(collection,data){
		var found = false;
		angular.forEach(collection, function(area){
			if(area.hasOwnProperty("formatted_address")){
				if(area.formatted_address == data.formatted_address){
					found = true;
					return found;
				}
			}
		});
		return found;
	}
	   

  	/**
	 * Redirect to hairdresser Account
	 */		
  	goBackToHairdresserAccount(){
		var self=this;
		self.$location.path('/hairdresser/account');
	}

	/**
	 * [displayConfirmationModal Function used to display a confirmation message on error or success]
	 * @param  {[type]} message [message displayed in the modal]
	 * @param  {[type]} flag    [success (true) or error (false) flag]
	 */
	displayConfirmationModal(message,flag){
		var self = this;
		self.ModalFactory.trigger(self,'confirmation-modal.html','hairdresserPreference', function($uibModalInstance,topController){
			this.message = message;
			this.isSuccess=flag;
			this.ok = ()=>{
				//self.$window.location.reload();
				$uibModalInstance.close('close');
			};
		});
	}
}//end class
HairdresserareaController.$inject =['API','$log','$location','Auth','$stateParams','$q','$scope','ModalFactory','hairdresserMAnager'];
export {HairdresserareaController};