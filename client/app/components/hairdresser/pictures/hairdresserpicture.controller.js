class HairdresserpictureController {
	  constructor($location,$log,hairdresserMAnager,$q,pictures,$scope,ModalFactory,$timeout,$state,haircutCategory,hairdresserResource) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.$q=$q;
	  	self.hairdresser={};
	  	self.profile_picture="";
	  	self.hairdresserMAnager = hairdresserMAnager;
		self.hairdresserResource = hairdresserResource;
	  	self.$timeout=$timeout;
	  	self.$location =$location;  	
	  	self.$log = $log;
	  	self.$state=$state;
		//Array containing the list of available categories's name defined by the admin
		self.availableHaircutCategories = [];
		//Array containing the list of catgories object defined by the admin. 
		self.availableHaircutCompleteCategories = [];
	    var init = (data) => {			
	     self.hairdresserResource.getAvailableHaircutCategories()
	      .then((results) => {
			  self.availableHaircutCompleteCategories = results.data;
			  results.data.map( (category ) => {
				self.availableHaircutCategories.push(category.name);				
			  });
			  
	     	 self.hairdresser= data.hairdresser;
	     	 $scope.profile_picture= self.hairdresser.profile_picture;
	          self.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(self.hairdresser.appointments);
	      }, function HairdresserControllerGetProfileErrorCallback(err){

	      });
	    };

	    self.updateHairdresserProfile = (hairdresser) => {
	  		Auth.updateUserProfile(`${API.dev.hairdresserRoute}`,hairdresser)
	  		.then(function HairdresseraccountControllerUpdateSuccessCallback(rep){
	  			self.hairdresser =rep;
	  		}, function HairdresseraccountControllerUpdateErrorCallback(err){
	  			$log.error(err);
	  		})
	  	};
	    self.LaunchAddCategoryForm = () => {
	    	var top = this;
	   	  ModalFactory.trigger(top,'new-category.html',function ( $uibModalInstance,topController){
				var $ctrl = this;
				$ctrl.multipleSelect= [];
				$ctrl.detailAlerts = [];
				//close an alert 				
				$ctrl.closeDetailAlert = function(ind){
				      $ctrl.detailAlerts.splice(ind,1);
			    };
				//update hairdresser's haircut categories
				$ctrl.updateCategories = (categories,categoryState)=>{
						
					if(topController.hairdresserMAnager.availableHaircutCategories.length>0){
						var found=false;
						//check if the category selected is not already in use by the hairdresser
						
						angular.forEach(topController.hairdresser.categories, function(category,index){
							if(category.name.toUpperCase() == topController.hairdresserMAnager.availableHaircutCategories[categories].toUpperCase()){								
								found=true;
								return found;
							}
						});
						if(found){
							$ctrl.detailAlerts.push({ type: 'danger', msg: 'Cette catégorie est déjà prise en compte.'});
						}else{
							topController.hairdresserMAnager.updateHaircutCategory({id:topController.hairdresser._id,name:topController.hairdresserMAnager.availableHaircutCategories[categories], state:categoryState})
							.then((result)=>{
								if(result.success){
						          topController.init(result.hairdresser);
						          $scope.detailAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
						        }else{
						          angular.forEach(result.errors, function(err, index){
						            $scope.detailAlerts.push({ type: 'danger', msg: err });
						          });
						        }
						      }, function(x){
						        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating hairdresser: ' + x });
						      })
							  .finally(()=>{
							  	topController.$timeout(()=>{
							  		$uibModalInstance.close('done');
							  	},2000);
							  });
						}
						
					}					
					
				};

				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
		 });		  
	 };// end updatePreferenceModal

	 self.redirectToCategoryDetails =(category,index)=>{	   	 
	   	 	if(category._id){	   	 		
	   	 		self.$state.go("hairdressercatalog",{id:category._id,name:category.name.split(' ')[0]+'-'+category.name.split(' ')[1]});
	   	 	}else{
	   	 		throw new Error(" the category id is not defined");
	   	 	}
	};

	self.getGaleryEntry = (id)=>{				
				var count =0;
				angular.forEach(self.hairdresser.gallery_pictures,function(entry){					
					if(entry.category == id && entry.published){
						count++;
					}
				});
				return count;
	};	 
	    init(pictures);

	};//end constructor;
	
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
}
HairdresserpictureController.$inject =['$location','$log','hairdresserMAnager','$q','pictures','$scope','ModalFactory','$timeout','$state','haircutCategory','hairdresserResource'];

export {HairdresserpictureController};


