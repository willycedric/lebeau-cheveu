class AccountSettingController {
	  constructor(Auth,API,ModalFactory,customerMAnager,$window,$state,AuthToken,accountResource,$q,$scope) {
	  	this.lastName=null;
	  	this.firstName=null;
	  	this.Auth = Auth;
	  	this.API =API;
	  	this.$window = $window;
	  	this.ModalFactory=ModalFactory;
	  	this.customerMAnager = customerMAnager;
	  	this.$state = $state;
	  	this.AuthToken= AuthToken;
		this.accountResource=accountResource;
		this.$q=$q;
		this.$scope =$scope;
		
		this.updateAddress = (location)=>{
			var self= this;
			var location ={};
			location.type =1;
			location.address = this.$scope.formatted_address;
			var successMessage = 'Votre nouvelle adresse a bien été prise en compte';
			var errorMessage= 'Une erreur est parvenue lors de la sauvegrade de votre nouvelle addresse. Veuillez essayer ultérieurement';
			this.customerMAnager.updateCustomerPreference(location)
			.then((rep)=>{
				this.displayConfirmationModal(successMessage,true);
			}, (err)=>{
				this.displayConfirmationModal(errorMessage,false);
		   });
		};
		
		var deserialize = ()=>{				
			var self=this;
			var defered = self.$q.defer();
			self.accountResource.getAccountDetails()
			.then((data)=>{
				defered.resolve(data);
			}, (err)=>{
				defered.resolve(err);
			});
			return defered.promise;			
		};
		var init = ()=>{
			var self=this;
			deserialize()
			.then((data)=>{
				console.log(data);
				self.customer = data.account;
				self.user = data.user;
			}, (err)=>{
				throw new Error(err.toString());
			});
		};
	 	init();
	};//end constructor;

	/**
	 * [launchUpdateProfileModal method used to display a modal allowing customer to update his profile informations]
	 */
	launchUpdateProfileModal(){
		var self=this;
		self.ModalFactory.trigger(self,'customerprofile.html','customer',function($uibModalInstance,topController){
					this.customer =topController.customer;
					this.user = topController.user;
					var data = {account:this.customer, user:this.user};
					const successMessage = 'Votre profil a bien mis à jour';
					const errorMessage ='Erreur lors de la mise à jour de votre profil';
					this.updateProfile = (updateForm)=>{
						console.log('pirstine ',updateForm.$pristine);
						if(!updateForm.$pristine){
							topController.Auth.updateProfile(`${topController.API.dev.customerRoute}`,data)
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
		self.ModalFactory.trigger(self,'confirmation-modal.html','customer', function($uibModalInstance,topController){
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
		self.ModalFactory.trigger(self,'customerpreferences.html','customer', function($uibModalInstance,topController){
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
		self.ModalFactory.trigger(self,'customerpreferences.html','customer', function($uibModalInstance,topController){
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
	/**
	 * [accountDeletionConfirmation description]
	 * @return {[type]} [description]
	 */
	accountDeletionConfirmation(){
		var self = this;
		self.ModalFactory.trigger(self,'account-deletion-confirmation.html','customer',function($uibModalInstance,topController){
			/**
			 * [description]
			 * @return {[type]} [description]
			 */
			this.message="Êtes-vous sûre de vouloir supprimer votre compte?";
			this.ok = ()=>{
				const successMessage = 'Votre compte a bien été supprimé .';
				const failureMessage = 'Une erreur s\'est propduite durant la suppression de votre compte';
				topController.customerMAnager.deleteUserAccount(topController.customer._id)
				.then(()=>{
					topController.AuthToken.erase('jwtToken');					
					
					//topController.$window.location.reload();					
				}, ()=>{
					topController.displayConfirmationModal(failureMessage,false);
				})
				.finally(()=>{
					
					topController.displayConfirmationModal(successMessage,true);
					topController.$state.go('home');
				});
				$uibModalInstance.close('OK');
			};

			/**
			 * [description]
			 * @return {[type]} [description]
			 */
			this.cancel = () =>{
				$uibModalInstance.dismiss('cancel');
			}
		})
	}
	/**
	 * [deleteLocation function allowing to delete a user location]
	 * @param  {[ObjectID]} locationId [user location ID]
	 * @return {[N/A]}            [N/A]
	 */
	deleteLocation(locationId){
			var self= this;
			if(self.customer.locations.length > 1){
				self.ModalFactory.trigger(self,'delete-location-confirmation.html','customer', function($uibModalInstance,topController){
					this.message = "Voulez supprimer cette addresse ?";
					this.ok = ()=>{
						var successMessage= "L\'adresse a bien été supprimée.";
						var errorMessage ="Une erreur s\'est propduite lors de la supression de l\'adresse";
						topController.customerMAnager.deleteCustomerLocation(locationId)
						.then(()=>{
							topController.displayConfirmationModal(successMessage,true); 
							$uibModalInstance.close('ok'); 
						}, ()=>{
						topController.displayConfirmationModal(errorMessage,false);
						$uibModalInstance.close('error');
						});
					};

					this.cancel = () =>{
						$uibModalInstance.dismiss('cancel');
					}
				});
		}else{
			self.ModalFactory.trigger(self,'unique-location.html','customer',function($uibModalInstance,topController){
				this.message = "Vous devez avoir au moins une adresse enregistrée.";
				this.ok = ()=>{
					$uibModalInstance.close('ok');
				};
			});
		}
	}

	
}//End class

AccountSettingController.$inject =['Auth','API','ModalFactory','customerMAnager','$window','$state','AuthToken','accountResource','$q','$scope'];

export {AccountSettingController};
