
import images from '../../../../images.json';
import {ModalInstanceCtrl} from './../login/modalCtrl';
class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope,AuthToken,$window,API,$log,$uibModal,$hairdresserMAnager,$customerMAnager) {

        /**
         * Parameters definition
         */
             $scope.this =this;
             this.nbImages = 3;//images.length;
            this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1475226327/banner10_fdlxry.jpg"; 
            this._id = $stateParams.id;
            this.isCustomHeaderOpen =false;
            this.selectedTimeSlot = new Date();
            this.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
            let loggedCustomerInformation = AuthToken.parseToken(AuthToken.getToken());
            $log.debug(' information ', loggedCustomerInformation);
          /**
           * Get Hairdresser by id, (must be modified to get hairdresser bu username)
           */
            Auth.getHairdresserById(this._id)
            .then(function ShowhairdresserprofileControllerSuccessCallback(response){
              $log.log('response ', response);
                 $scope.this.hairdresser = response;
                 $scope.this.days = [];
                 $scope.this.times =[];
                angular.forEach(response.appointments,function(resp,key){
                    $scope.this.days.push(resp.dayOfWeek);
                    $scope.this.times[key] = [];
                    $scope.this.times[key].push(resp.slotTime);           
                });
                $log.debug($scope.this.times[0]);
            }, function ShowhairdresserprofileControllerFailureCallback(err){
                console.error(err);
            });
        /**
         * Carousel Logic for hairdresser
         */
          
            this.myInterval = 7000;
            this.noWrapSlides = false;
            this.active = 0;
            const slides = this.slides = [];
            let currIndex = 0;
            this.addSlide = function(i) {
              const newWidth = 1280 + slides.length + 1;
              slides.push({
                image:images[i].url,
                id: currIndex++
              }); 
            };

            $log.debug(slides);

            for (let i = 0; i < this.nbImages; i++) {
              this.addSlide(i);
            }

            this.onSlideChanged = function (nextSlide, direction, nextIndex) {
                //console.log("slide changed: ",nextIndex);
            }

        /**
         * Logbook cell management logic
         */

        /**
         * Function used to display the login modal when the customer is not logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
           this.displayLoginModal = (size)=>{
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
               }; //end displayLoginModal
        /**
         * [rowClicked description]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
        */
          this.rowClicked = function(dayOfWeek,index,appointmentId,val){
            if(loggedCustomerInformation && loggedCustomerInformation.role == 2){
               if(val == 0){
                $log.debug('Hairdresser dispo');
                this.displayConfirmationModal(dayOfWeek,index,appointmentId,loggedCustomerInformation._id);
               }else{
                this.displayAlreadyReserved(dayOfWeek,index,appointmentId,val);
                $log.debug('Hairdresser rsv');
               }
            }else if(loggedCustomerInformation && loggedCustomerInformation.role == 1){
                this.displayOnlyForCustomerModal();
            }
            else{
                //prompt the user to register or login  
                //$window.location.href=`${API.dev.login}`
                //user must be sent back to the hairdresser profile
                //this.displayLoginModal();
                 this.displayModalAskingToLoggedin();
            }
          };
        /**
         * Function used to display a modal asking for use to logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayModalAskingToLoggedin = (size)=>{
                  var self = this;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'confirmation.html',
                  controller:function($uibModalInstance){
                      this.ok = ()=>{
                        self.displayLoginModal();
                        $uibModalInstance.close('cancel');
                        //$log.debug('clicked on the ok button');
                      };

                      this.cancel = ()=>{
                        //$log.debug('clicked on the cancel button');
                        $uibModalInstance.close('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
        };
        /**
         * Confirmation Modal
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayConfirmationModal = (dayOfWeek,index,appointmentId,customerId,size)=>{
                  var self = this;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'slot-confirmation.html',
                  controller:function($uibModalInstance){
                    this.selectedTimeSlot = dayOfWeek;
                    this.slotHour = self.openingHourList[index]; 
                      this.ok = ()=>{
                        self.updateAppointmentSlot(self.hairdresser._id,appointmentId,index,customerId);
                        self.updateCustomerAppointmentSlot(self.hairdresser._id,appointmentId,index,dayOfWeek);
                        $window.location.reload();
                       $uibModalInstance.close('cancel');
                        
                      };

                      this.cancel = ()=>{
                        $uibModalInstance.close('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size,
                  resolve: {
                    times: function () {
                      return  self.selectedTimeSlot;
                    }
                  }
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
        };
        /**
         * [description]
         * @param  {[type]} dayOfWeek     [description]
         * @param  {[type]} index         [description]
         * @param  {[type]} appointmentId [description]
         * @param  {[type]} size          [description]
         * @return {[type]}               [description]
         */
        this.displayAlreadyReserved = (dayOfWeek,index,appointmentId,size)=>{
                  var self = this;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'slot-reservation.html',
                  controller:function($uibModalInstance){
                    this.selectedTimeSlot = dayOfWeek;
                    this.slotHour = self.openingHourList[index]; 
                      this.ok = ()=>{
                        $uibModalInstance.close('cancel');
                        
                      };

                      this.cancel = ()=>{
                        $uibModalInstance.close('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size,
                  resolve: {
                    times: function () {
                      return  self.selectedTimeSlot;
                    }
                  }
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  //$log.info('Modal dismissed at: ' + new Date());
                });
        };
        /**
         * [update the hairdresser account with the new appointment]
         * @param  {[type]} hairdresserId [description]
         * @param  {[type]} appointmentId  [description]
         * @param  {[type]} slotIndex     [description]
         * @return {[type]}               [description]
         */
        this.updateAppointmentSlot = (hairdresserId, appointmentId,slotIndex,customerId) =>{
          $hairdresserMAnager.updateAppointmentSlot(hairdresserId, appointmentId,slotIndex,customerId)
          .then(function updateAppointmentSlotProfileControllerSuccessCallback(response){
              $log.info('inside the success callback');
          },function updateAppointmentSlotProfileControllerErrorCallback(err){
              $log.info('inside the error callback')
          });
        };
        /**
           * [Update the appointment in the customer profile]
         * @param  {[type]} hairdresserId [description]
         * @param  {[type]} appointmentId [description]
         * @param  {[type]} slotIndex     [description]
         * @param  {[type]} customerId    [description]
         * @return {[type]}               [description]
         */
        this.updateCustomerAppointmentSlot = (hairdresserId, appointmentId,slotIndex,customerId)=>{
          $customerMAnager.updateCustomerAppointmentSlot(hairdresserId, appointmentId,slotIndex,customerId)
          .then(function updateAppointmentCustomerSlotControllerSuccessCallback(response){
              $log.info('inside the success callback');
          },function updateAppointmentCustomerSlotControllerErrorCallback(err){
              $log.info('inside the error callback')
          });
        };

        /**
         * [display a message wich inform that the logbook is only accessible to customer not hairdresser]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayOnlyForCustomerModal = (size)=>{
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'only-customer.html',
                  controller:function($uibModalInstance){
                      this.ok = ()=>{
                        $uibModalInstance.close('cancel');
                        
                      };

                      this.cancel = ()=>{
                        $uibModalInstance.close('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size
                });
               modalInstance.result.then(function () {
                 
                }, function () {
                 
                });
        };

}//end constructor
}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log','$uibModal','$hairdresserMAnager','$customerMAnager'];
export {ShowhairdresserprofileController};


