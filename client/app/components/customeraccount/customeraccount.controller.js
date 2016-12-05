class CustomeraccountController {
	  constructor(Auth,API,ModalFactory,customerMAnager,$window) {
	  	this.lastName=null;
	  	this.firstName=null;
	  	this.Auth = Auth;
	  	this.API =API;
	  	this.$window = $window;
	  	this.ModalFactory=ModalFactory;
	  	this.customerMAnager = customerMAnager;

	 	//while the user still connected the token is available from the local storage	
     	//this.refreshCustomerProfile(this,token);        
		Auth.getProfile(`${API.dev.customerRoute}`+'/me')
	      .then((rep)=>{
	          this.customer = rep;
        });
	};//end constructor;

	/**
	 * [launchUpdateProfileModal method used to display a modal allowing customer to update his profile informations]
	 */
	launchUpdateProfileModal(){
		var self=this;
		self.ModalFactory.trigger(self,'customerprofile.html',function($uibModalInstance,topController){
					this.customer =topController.customer;
					const successMessage = 'Votre profil a bien mis à jour';
					const errorMessage ='Erreur lors de la mise à jour de votre profil';
					this.updateProfile = (updateForm)=>{
						console.log('pirstine ',updateForm.$pristine);
						if(!updateForm.$pristine){
							topController.Auth.updateProfile(`${topController.API.dev.customerRoute}`,topController.customer)
							.then((rep)=>{
								topController.displayConfirmationModal(successMessage,true);
							},(err)=>{
								topController.displayConfirmationModal(errorMessage,false);
							});
							$uibModalInstance.close('close');
						}else{
							$uibModalInstance.close('close');
						}						
					};
					this.cancel = () =>{
						$uibModalInstance.dismiss('close');
					};
		});
	};

	/**
	 * [displayConfirmationModal Function used to display a confirmation message on error or success]
	 * @param  {[type]} message [message displayed in the modal]
	 * @param  {[type]} flag    [success (true) or error (false) flag]
	 */
	displayConfirmationModal(message,flag){
		var self = this;
		self.ModalFactory.trigger(self,'confirmation-modal.html', function($uibModalInstance,topController){
			this.message = message;
			this.isSuccess=flag;
			this.ok = ()=>{
				self.$window.location.reload();
				$uibModalInstance.close('close');
			};
		});
	}

	/**
	 * [updatePreferenceModal Methode used to update the customer preferences]
	 * @return {[type]} [description]
	 */
	updatePreferenceModal(){
		var self = this;
		self.ModalFactory.trigger(self,'customerpreferences.html', function($uibModalInstance,topController){
			this.location ={};//empty location object
			this.updatePreference = (preferenceForm,location)=>{
				var successMessage = 'Votre nouvelle adresse a bien été prise en compte';
				var errorMessage= 'Une erreur est parvenue lors de la sauvegrade de votre nouvelle addresse. Veuillez essayer ultérieurement';
				if(!preferenceForm.$pristine){
					topController.customerMAnager.updateCustomerPreference(location)
					.then((rep)=>{
						topController.displayConfirmationModal(successMessage,true);
					}, (err)=>{
						topController.displayConfirmationModal(errorMessage,false);
					});
					$uibModalInstance.close('close');
				}else{
					$uibModalInstance.close('close');
				}
			};

			this.cancel = ()=>{
				$uibModalInstance.dismiss('cancel');
			};
		});
	}

	updateLocation(location){
		var self = this;
		self.ModalFactory.trigger(self,'customerpreferences.html', function($uibModalInstance,topController){
			this.location=location;
			this.updatePreference = (preferenceForm,location)=>{
				var successMessage = 'Votre nouvelle adresse a bien été prise en compte';
				var errorMessage= 'Une erreur est parvenue lors de la sauvegrade de votre nouvelle addresse. Veuillez essayer ultérieurement';
				if(!preferenceForm.$pristine){
					topController.customerMAnager.updateCustomerPreference(location)
					.then((rep)=>{
						topController.displayConfirmationModal(successMessage,true);
					}, (err)=>{
						topController.displayConfirmationModal(errorMessage,false);
					});
					$uibModalInstance.close('close');
				}else{
					$uibModalInstance.close('close');
				}
			};

			this.cancel = ()=>{
				$uibModalInstance.dismiss('cancel');
			};
		});
	}
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
}//End class

CustomeraccountController.$inject =['Auth','API','ModalFactory','customerMAnager','$window'];

export {CustomeraccountController};
