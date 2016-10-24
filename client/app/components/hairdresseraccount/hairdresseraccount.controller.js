
class HairdresseraccountController {
  constructor($uibModal,API,Auth,$log) {
	   var self=this;
	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	  	.then(function hairdresserProfileSuccesscallback(rep){
	  			self.hairdresser = rep;
	  	}, function hairdresserProfileErrorCallback (err){
	  		$log.error(new Error("hairdresser account error callback "+err));
	  	});

	  	/**
	       * [launchLoginModal description]
	       * @param  {[type]} size [description]
	       * @return {[type]}      [description]
	       */
	      self.launchUpdateModal = function(size){
	      var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'haidresserProfile.html',
	      controller:function ( $uibModalInstance){
		var $ctrl = this;
		Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	  	.then(function hairdresserProfileModalCtrlSuccesscallback(rep){
	  			$ctrl.hairdresser = rep;
	  	}, function hairdresserProfileModalCtrlErrorCallback (err){
	  		$log.error(new Error("hairdresser account error callback "+err));
	  	});

		$ctrl.ok = ()=>{
			$uibModalInstance.close($ctrl.hairdresser);
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
	   };
  } //end constructor

}

HairdresseraccountController.$inject =['$uibModal','API','Auth','$log'];
export {HairdresseraccountController};


