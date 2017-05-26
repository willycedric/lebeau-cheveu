
class HairdresseraccountController {
  constructor($uibModal,API,Auth,ModalFactory,$log,hairdresserMAnager,$q,$state,$window,hairdresserResource,$scope,$http,$location) {

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
	 	self.$state =$state;
	 	self.$window=$window;
	 	self.hairdresserMAnager= hairdresserMAnager;
		 self.Auth = Auth;
		 this.$scope =$scope;	 
		 self.$q =$q;
		 self.hairdresserResource = hairdresserResource;
		 self.$location =$location;
		 self.hairdresserDetails={};

		var deserialize = ()=>{
			var defered = self.$q.defer();
			self.hairdresserResource.getSettings()
			.then((rep)=>{
				defered.resolve(rep);
			},(err)=>{
				defered.reject(rep);
			});
			return defered.promise;
		}

		var init = ()=>{
			deserialize()
			.then((data)=>{
				if(data.hasOwnProperty("hairdresser")){
				self.hairdresser = data.hairdresser;
				self.hairdresserDetails.customer_type = self.hairdresser.customer_type;
				self.hairdresserDetails.listOfPerformance = self.hairdresser.listOfPerformance;
				self.hairdresserDetails.categories = self.hairdresser.categories;
				//console.log(self.hairdresser);	
				}	
				if(data.hasOwnProperty("user")){
					self.user = data.user;	
				}				
				self.count =hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
			},(err)=>{
				throw new Error(err.toString());
			});
		}
			
			
	
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
				$ctrl.listOfAvailableHaircut = topController.listOfAvailableHaircut;
				$ctrl.multipleSelect2 = [];
				angular.forEach(topController.hairdresser.categories,(elt)=>{
					$ctrl.multipleSelect2.push(elt.name);
				});
				$ctrl.updatePreference = (multipleSelect1, multipleSelect2,multipleSelect3)=>{
				
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
					angular.forEach($ctrl.multipleSelect2, function(val, key){
						if(val === "CHEVEUX AFRO"){
							$ctrl.hairdresser.categories.push("cheveux afro");
						}else if(val ==="CHEVEUX LISSES"){
							$ctrl.hairdresser.categories.push("cheveux lisses");
						}else{
							$ctrl.hairdresser.categories.push("cheveux bouclés");
						}
					});
				}
				if(multipleSelect3===undefined){

				}
				//update the hairdresser performance list
				else if(multipleSelect3!= undefined && multipleSelect3.length!= 0){
					$ctrl.hairdresser.listOfPerformance=[];
					angular.forEach(multipleSelect3, (val, key)=>{
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
					//deserialize(rep.data);
					init();
					//console.log("update hairdresser", rep);
				}, (err)=>{
					throw new Error(err.toString());
				})
				.finally((rep)=>{
					topController.displayConfirmationModal("Vos Informations ont bien été enregistées.",true);
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
						//deserialize(rep);
						init();
					}, function HairdresseraccountControllerUpdateErrorCallback(err){
						throw new Error(err.toString());
					})			 
					.finally(()=>{
						topController.displayConfirmationModal('Votre description a bien été enregistrée.',true);						
					})						
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			});	   
	};// end updateDescriptionModal

	//deserialize(settings);
	init();
  } //end constructor

				/**
				 * delete the connected hairdresser cover area with the specified id
				 * @param {*} id mongodb objectId
				 */
				deleteArea(id){
					var self=this;
					self.hairdresserMAnager.deleteHairdresserCovereArea(id)
					.then((rep)=>{
						self.displayConfirmationModal("La location a bien été supprimée de votre list de zones couvertes.", true);
					},(err)=>{
						self.displayConfirmationModal("une erreur est survenue pendant la mise à jour de votre profil. Veuillez recommencer ultérieurement",false);
					})
				}
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

	
	updateCustomerType(){
		var self = this;
		self.ModalFactory.trigger(self, 'hairdresserCutomerType.html','hairdresserPreference', function($uibModalInstance, topController){
			this.updateCustomerType = (selections)=>{
				console.log("Current selctions ",selections);
			};
			this.cancel = ()=>{
				$uibModalInstance.dismiss('cancel');
			}
		})
	}
	/**
	 * Redirect hairdresser to the description edition page.
	 * @param {*ObjectId} id 
	 */
	updateHairdresserInformations(information){
		var self=this;		
		//self.$location.path(information);		
		self.$state.go("hairdressersettingsedit",{details:self.hairdresserDetails});
	}

	/**
	 * 
	 * @param {*} activityArea 
	 */
	updateHairdresserCoverArea(activityArea){
		console.log('HairdesserActivity', activityArea);
		var self=this;
		self.$state.go('hairdresserareaedit',{area:activityArea});
	}

}//end class
HairdresseraccountController.$inject =['$uibModal','API','Auth','ModalFactory','$log','hairdresserMAnager','$q','$state','$window','hairdresserResource','$scope','$http','$location'];
export {HairdresseraccountController};