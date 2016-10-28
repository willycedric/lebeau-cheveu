
class HairdresseraccountController {
  constructor($uibModal,API,Auth,$log) {
	   var self=this;
	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	  	.then(function hairdresserProfileSuccesscallback(rep){
	  			self.hairdresser = rep;
	  	}, function hairdresserProfileErrorCallback (err){
	  		$log.error(new Error("hairdresser account error callback "+err));
	  	});


	  	self.updateHairdresserProfile = (hairdresser)=>{
	  		$log.debug('hairdresser ', hairdresser);
	  		Auth.updateUserProfile(`${API.dev.hairdresserRoute}`,hairdresser)
	  		.then(function HairdresseraccountControllerUpdateSuccessCallback(rep){
	  			self.hairdresser =rep;
	  		}, function HairdresseraccountControllerUpdateErrorCallback(err){
	  			$log.error(err);
	  		})
	  	};

	  	/**
	       * [launchLoginModal description]
	       * @param  {[type]} size [description]
	       * @return {[type]}      [description]
	       */
	      self.launchUpdateProfileModal = function(size){
	      var topCtrl = self;
	      var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'haidresserProfile.html',
	      controller:function ( $uibModalInstance,hairdresser){

				var $ctrl = this;
				$ctrl.hairdresser =hairdresser;
				$ctrl.updateProfile = ()=>{
					topCtrl.updateHairdresserProfile($ctrl.hairdresser);
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			},
	      controllerAs: '$ctrl',
	      size: size,
	      resolve: {
	        hairdresser: function () {
	          return  self.hairdresser;
	        }
	      }
	    });
	    modalInstance.result.then(function (selectedItem) {
	     // $ctrl.selected = selectedItem;
	      
	     $log.debug(selectedItem);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	   }; //end updateProfile

	   self.updatePreferenceModal = (size)=>{
	   	  var topCtrl = self;
	      var topCtrl = self;
	      var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'hairdresserPreference.html',
	      controller:function ( $uibModalInstance,hairdresser){

				var $ctrl = this;
				$ctrl.multipleSelect= [];
				$ctrl.hairdresser =hairdresser;
				
				$ctrl.updatePreference = (multipleSelect1, multipleSelect2)=>{
				
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
					

					topCtrl.updateHairdresserProfile($ctrl.hairdresser);
					$uibModalInstance.close('close');
				};
				$ctrl.cancel = () =>{
					$uibModalInstance.dismiss('close');
				};
			},
	      controllerAs: '$ctrl',
	      size: size,
	      resolve: {
	        hairdresser: function () {
	          return  self.hairdresser;
	        }
	      }
	    });

	   
	}// end updatePreferenceModal


  } //end constructor

}

HairdresseraccountController.$inject =['$uibModal','API','Auth','$log'];
export {HairdresseraccountController};


