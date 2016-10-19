import {ModalInstanceCtrl} from './modalCtrl';
class LoginController {
  constructor($uibModal,$log,$window,AuthToken,$state) {
      var self =this;
      self.message="empty string";

      /**
       * [launchLoginModal description]
       * @param  {[type]} size [description]
       * @return {[type]}      [description]
       */
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

   /**
    * [description]
    * @return {[type]} [description]
    */
   self.goToLoginform = () =>{
    //If a user is already logged redirect to his profil
      if(AuthToken.getToken()){
        var loggedUserDetails = AuthToken.parseToken(AuthToken.getToken());
        if(loggedUserDetails.role == 2){ //redirecting to customer profile
             $state.go('customer');
        }else if(loggedUserDetails.role == 1){//redirecting to hairdresser profile
             $state.go('hairdresser');
        }     
   } else{
         self.launchLoginModal();
      }
 }
 
  }//End constructor

}

LoginController.$inject = ['$uibModal','$log', '$window','AuthToken','$state'];

export {LoginController};


