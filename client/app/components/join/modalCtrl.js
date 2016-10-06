class ModalInstanceCtrl {
  constructor($uibModalInstance,$log,items) {
    //	var $ctrl = this;
      this.items = items;
      this.selected = {
        item: this.items[0]
      };

      this.ok = function () {
        $log.debug('inside the ok');
        $uibModalInstance.close(this.selected.item);
      };

      this.cancel = function () {
        $log.debug('inside the cancel');
        $uibModalInstance.dismiss('cancel');
      };
  }
}
export {ModalInstanceCtrl};
