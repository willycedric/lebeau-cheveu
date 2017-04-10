const ModalFactory = ($uibModal,$window) =>{

	/**
	 * [trigger description]
	 * @type {[type]}
	 */
	const trigger = (controller,templateURL,customClass,fn)=>{
				//defining modal custom class
				var custom = (customClass==undefined)?"custom":customClass;
	      var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: templateURL,
	      controller:fn,
				windowClass:custom,
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