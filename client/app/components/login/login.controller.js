import {ModalInstanceCtrl} from './modalCtrl';
class LoginController {
  constructor($uibModal,$log,$window) {
      var self =this;
      self.message="empty string";
      self.launchLoginModal = function(size){
      var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'login.html',
      controller: ModalInstanceCtrl,
      controllerAs: 'vm',
      size: size
     /* resolve: {
        items: function () {
          return  self.message;
        }
      }*/
    });

   modalInstance.result.then(function (selectedItem) {
     // $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
   };

   self.launchLoginForm = () =>{
    $log.debug("inside the function");
   }
  }//End constructor

}

LoginController.$inject = ['$uibModal','$log', '$window'];

export {LoginController};


