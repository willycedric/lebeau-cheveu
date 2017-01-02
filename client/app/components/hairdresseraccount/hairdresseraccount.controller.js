
class HairdresseraccountController {
  constructor($uibModal,API,Auth,ModalFactory,$log,hairdresserMAnager,AuthToken,$state,$window) {

  		  var self=this;
  		//List of department in Ile de France
  	   self.listOfIleDeFranceDepartement=["91-Essonne","92-Hauts-de-Seine","94-Val-de-Marne","78-Yvelines","75-Paris","77-Seine-et-Marne","93-Seine-Saint-Denis","95-Val-d'Oise"];
  	   self.listOfAvailableHaircut =["Vanilles",
									"Tresses (Braids)",
									"Crochet braids",
									"Tissages",
									"Locks ",
									"Coiffures sur cheveux naturels ",
									"Lissages (Brushing, Défrisage)",
									"Extensions de cheveux ",
									"Colorations",
									"Perruque / Lace wig",
									"Shampoing",
									"Nattes collées",
									"Cornrows",
									"Tresses enfants"];
	 	/**
	 	 * 
	 	 */
	 	self.ModalFactory=ModalFactory;
	 	self.AuthToken=AuthToken;
	 	self.$state =$state;
	 	self.$window=$window;
	 	self.hairdresserMAnager= hairdresserMAnager;

	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	  	.then(function hairdresserProfileSuccesscallback(rep){
	  			self.hairdresser = rep;
	  			 self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	  	}, function hairdresserProfileErrorCallback (err){
	  		$log.error(new Error("hairdresser account error callback "+err));
	  	});

	  	/**
	  	 * [description]
	  	 * @param  {[type]} hairdresser [description]
	  	 * @return {[type]}             [description]
	  	 */
	  	self.updateHairdresserProfile = (hairdresser)=>{
	  		Auth.updateUserProfile(`${API.dev.hairdresserRoute}`,hairdresser)
	  		.then(function HairdresseraccountControllerUpdateSuccessCallback(rep){
	  			self.hairdresser =rep;
	  		}, function HairdresseraccountControllerUpdateErrorCallback(err){
	  			$log.error(err);
	  		})
	  	};

	   /**
	    * [description]
	    * @return {[type]} [description]
	    */
	   self.launchUpdateProfileModal = ()=>{
	   		ModalFactory.trigger(self,'hairdresserProfile.html',function ( $uibModalInstance,topController){

				var $ctrl = this;
				$ctrl.hairdresser =topController.hairdresser;
				$ctrl.updateProfile = ()=>{
					topController.updateHairdresserProfile($ctrl.hairdresser);
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			});
	   }; //end updateProfileMdal

	   /**
	    * [description]
	    * @return {[type]} [description]
	    */
	   self.updatePreferenceModal = ()=>{
	   	  ModalFactory.trigger(self,'hairdresserPreference.html',function ( $uibModalInstance,topController){

				var $ctrl = this;
				$ctrl.multipleSelect= [];
				$ctrl.hairdresser =topController.hairdresser;
				$ctrl.listOfIleDeFranceDepartement = topController.listOfIleDeFranceDepartement;
				$ctrl.listOfAvailableHaircut = topController.listOfAvailableHaircut;
				$ctrl.updatePreference = (multipleSelect1, multipleSelect2,multipleSelect3,multipleSelect4)=>{
				
				//if more than one value, the customer type is both men and women
				if(multipleSelect1 === undefined){
					
				}else if (multipleSelect1.length > 1){ // either men or women
					$ctrl.hairdresser.customer_type = 0;
				}else{
					$ctrl.hairdresser.customer_type=parseInt(multipleSelect1[0]);
				}
				// Updating  haircuts categories of the hairdresser
				if(multipleSelect2 === undefined){

				}
				else if(multipleSelect2.length!= 0){
					$ctrl.hairdresser.categories = [];
					angular.forEach(multipleSelect2, function(val, key){
						if(val === "0"){
							$ctrl.hairdresser.categories.push("cheveux bouclés");
						}else if(val ==="1"){
							$ctrl.hairdresser.categories.push("cheveux afro");
						}else{
							$ctrl.hairdresser.categories.push("cheveux lisses");
						}
					});
				}

				if(multipleSelect3 != undefined && multipleSelect3.length!= 0){					
					$ctrl.hairdresser.activityArea=[];
					angular.forEach(multipleSelect3, (val, key)=>{
						$ctrl.hairdresser.activityArea.push($ctrl.listOfIleDeFranceDepartement[parseInt(val)]);
					});
				}
				//update the hairdresser performance list
				if(multipleSelect4!= undefined && multipleSelect4.length!= 0){
					$ctrl.hairdresser.listOfPerformance=[];
					angular.forEach(multipleSelect4, (val, key)=>{
						$ctrl.hairdresser.listOfPerformance.push($ctrl.listOfAvailableHaircut[parseInt(val)]);
					});
				}
				

				topController.updateHairdresserProfile($ctrl.hairdresser);
				$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
		 });
	   
	 };// end updatePreferenceModal

	self.updateDescriptionModal = ()=>{
		ModalFactory.trigger(self,'hairdresserDescription.html',function ( $uibModalInstance,topController){
				var $ctrl = this;
				$ctrl.multipleSelect= [];
				$ctrl.hairdresser =topController.hairdresser;
				$ctrl.updateDescription = (hairdresserDescription)=>{
					$ctrl.hairdresser.description=hairdresserDescription;			
					topController.updateHairdresserProfile($ctrl.hairdresser);
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			});	   
	};// end updateDescriptionModal

  } //end constructor

  			/**
  			 * [updateHairdresserSetting description]
  			 * @param  {[Array]} hairdresserSelectedSettings [List of selected settings]
  			 * @param  {[array]} hairdresserSettingsList     [hairdresser settings]
  			 * @param  {[array]} listOfAvailableSettings     [list of available settings]
  			 * @return {[type]}                             [N/A]
  			 */
  			updateHairdresserSetting(hairdresserSelectedSettings, hairdresserSettingsList, listOfAvailableSettings){
				hairdresserSettingsList =[];
				if(hairdresserSelectedSettings != undefined && hairdresserSelectedSettings.length!=0){
					angular.forEach(hairdresserSelectedSettings, (val,key)=>{
						hairdresserSettingsList.push(listOfAvailableSettings[parseInt(val)]);
					});

					return hairdresserSettingsList;
				}
			}

			/**
			 * [deleteHairdresserAccount description]
			 * @return {[type]} [description]
			 */
			deleteHairdresserAccount(id){
				var self = this;
				self.ModalFactory.trigger(self,'delete-account.html', function($uibModalInstance,topController){
					this.message = 'Etes-vous sûre de vouloir supprimer votre compte ?';

					this.ok = () =>{
						const  successMessage = 'votre compte a été supprimé avec succès.';
						const  errMessage = 'Une erreur est survenue lors de la suppression de votre compte utilisateur.';

						topController.hairdresserMAnager.deleteHairdresserAccount(id)
						.then(()=>{
							topController.AuthToken.erase('jwtToken');
						},()=>{
							topController.displayConfirmationModal(errorMessage,false);
						})
						.finally(()=>{
							topController.$state.go('home');
							topController.displayConfirmationModal(successMessage,true);
						})
						$uibModalInstance.close('OK');
					};

					this.cancel = () =>{
						$uibModalInstance.dismiss('cancel');
					};
				});
			}

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

}//end class

HairdresseraccountController.$inject =['$uibModal','API','Auth','ModalFactory','$log','hairdresserMAnager','AuthToken','$state','$window'];
export {HairdresseraccountController};


