class ModalInstanceCtrl {
  constructor($uibModalInstance,$log,items) {
    this.message = "Checking double binding dsdsdsdsdsdsds";
    $log.debug('Hello from the sub controller');
    //	var $ctrl = this;
     this.items = items;
     $log.debug(this.items);

      this.ok = function () {
        $log.debug('inside the ok');
       // $uibModalInstance.close(this.selected.item);
      };

      this.cancel = function () {
        $log.debug('inside the cancel');
        //$uibModalInstance.dismiss('cancel');
      };
      this.launchLoginForm = function(){
        $log.debug('clicked on the login form ');
      };
  }
}
export {ModalInstanceCtrl};
