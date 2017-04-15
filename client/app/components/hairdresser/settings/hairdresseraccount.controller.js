
class HairdresseraccountController {
  constructor($uibModal,API,Auth,ModalFactory,$log,hairdresserMAnager,AuthToken,$state,$window,settings,$scope,$http,$timeout) {

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
		 self.$timeout =$timeout;
		 self.Auth = Auth;

	   /* Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	  	.then(function hairdresserProfileSuccesscallback(rep){
	  			self.hairdresser = rep;
	  			 self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	  	}, function hairdresserProfileErrorCallback (err){
	  		$log.error(new Error("hairdresser account error callback "+err));
	  	});*/
	  var deserialize = function(data){
		  if(data.hasOwnProperty("hairdresser")){
			self.hairdresser = data.hairdresser;
			 console.log(self.hairdresser);	
		  }	
		  if(data.hasOwnProperty("user")){
			self.user = data.user;	
		  }		 
	  	self.profile_picture=self.hairdresser.profile_picture;
	  	self.count =hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	  };
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
					.finally(()=>{
						topController.displayConfirmationModal(successMessage,true);
						topController.$timeout(()=>{

						},1000)
						topController.$window.reload();
					})
	  	};

	   /**
	    * [description]
	    * @return {[type]} [description]
	    */
	   self.launchUpdateProfileModal = ()=>{
		   var self=this;
	   		ModalFactory.trigger(self,'hairdresserProfile.html','hairdresserPreference',function ( $uibModalInstance,topController){

				var $ctrl = this;
				$ctrl.hairdresser =topController.hairdresser;
				$ctrl.user = topController.user;
				$ctrl.updateProfile = ()=>{
					var data = {
						hairdresser:$ctrl.hairdresser,
						user:$ctrl.user
					};
					topController.updateHairdresserProfile(data);
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
		   var self= this;
	   	  ModalFactory.trigger(self,'hairdresserPreference.html','hairdresserPreference',function ( $uibModalInstance,topController){

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
				
				var data = {
					hairdresser:$ctrl.hairdresser,
					user:topController.user
				};
				//self.updateHairdresserProfile(data)
				$http.put(`${API.dev.homeUrl}`+`${API.dev.hairdresserRoute}`+'/setting/preference',{user:data})
				.then((rep)=>{
					deserialize(rep.data);
					console.log("update hairdresser", rep);
				}, (err)=>{
					throw new Error(err.toString());
				})
				.finally((rep)=>{
					topController.displayConfirmationModal("Vos Informations ont bien été enregistées.",true);
					top.$timeout(()=>{

					},1000);
					topController.$window.location.reload();
					$uibModalInstance.close('close');
				})
				
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
		 });
	   
	 };// end updatePreferenceModal

	self.updateDescriptionModal = ()=>{
		ModalFactory.trigger(self,'hairdresserDescription.html','hairdresserPreference',function ( $uibModalInstance,topController){
				var $ctrl = this;
				$ctrl.multipleSelect= [];
				$ctrl.hairdresser =topController.hairdresser;
				
				$ctrl.updateDescription = (hairdresserDescription)=>{
					$ctrl.hairdresser.description=hairdresserDescription;	
					var data= {
						hairdresser:$ctrl.hairdresser,
						user:topController.user
					};		
					//topController.updateHairdresserProfile(data);
					topController.Auth.updateUserProfile(`${API.dev.hairdresserRoute}`,data)
					.then(function HairdresseraccountControllerUpdateSuccessCallback(rep){
						deserialize(rep);
					}, function HairdresseraccountControllerUpdateErrorCallback(err){
						throw new Error(err.toString());
					})			 
					.finally(()=>{
						topController.displayConfirmationModal('Votre description a bien été enregistrée.',true);
						topController.$timeout(()=>{

						},1000)
						topController.$window.reload();
					})						
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			});	   
	};// end updateDescriptionModal

	deserialize(settings);
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
				self.ModalFactory.trigger(self,'delete-account.html','hairdresserPreference', function($uibModalInstance,topController){
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
		self.ModalFactory.trigger(self,'confirmation-modal.html','hairdresserPreference', function($uibModalInstance,topController){
			this.message = message;
			this.isSuccess=flag;
			this.ok = ()=>{
				self.$window.location.reload();
				$uibModalInstance.close('close');
			};
		});
	}
	/**
	 * [getPendingAppointment description]
	 * @param  {[type]} appointments [description]
	 * @return {[type]}              [description]
	 */
	getPendingAppointment(appointments){
		let count=0;
		angular.forEach(appointments, (apt)=>{
			if(apt.appointmentState === -1){
				count++;
			}
		});
		return count;
	}

}//end class
HairdresseraccountController.$inject =['$uibModal','API','Auth','ModalFactory','$log','hairdresserMAnager','AuthToken','$state','$window','settings','$scope','$http','$timeout'];
export {HairdresseraccountController};