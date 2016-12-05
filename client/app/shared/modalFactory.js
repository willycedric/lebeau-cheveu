const ModalFactory = ($uibModal,$window) =>{

	/**
	 * [trigger description]
	 * @type {[type]}
	 */
	const trigger = (controller,templateURL,fn)=>{
	      var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: templateURL,
	      controller:fn,
	      controllerAs: '$ctrl',
	      size: 'sm',
	      resolve: {
	        topController: function () {
	          return  controller;
	        }
	      }
	    });
	    modalInstance.result.then(function (selectedItem) {
	     // $ctrl.selected = selectedItem;
	     // Update the view
	     //$window.location.reload();
	    }, function () {
	      /*$log.info('Modal dismissed at: ' + new Date());*/
	    });
	};

	return {
		trigger
	};

};

ModalFactory.$inject =['$uibModal','$window'];

export {ModalFactory};