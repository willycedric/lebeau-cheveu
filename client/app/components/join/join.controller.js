import join from './join.html';
class JoinController {
  constructor($uibModal,$log) {

  	var $ctrl = this;
	  $ctrl.items = ['item1', 'item2', 'item3'];

	  $ctrl.animationsEnabled = true;
  	
    this.url= "http://res.cloudinary.com/hgtagghpz/image/upload/v1475152779/smile_nucifu.jpg";
    $log.debug('Inside top');
    //var $ctrl = this;
    this.launchLoginModal = function(size){
    	var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'join.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });


    }//end launchModalFunction
   
  }

}

export {JoinController};


