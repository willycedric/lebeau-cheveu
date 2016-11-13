
import images from '../../../../images.json';
import {ModalInstanceCtrl} from './../login/modalCtrl';
class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope,AuthToken,$window,API,$log,$uibModal,hairdresserMAnager,customerMAnager,ModalFactory,$q){

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
            this.hairdresserMAnager = hairdresserMAnager;
            this.customerMAnager= customerMAnager;
            this.$q = $q;
            const currentDay = new Date();
            //let loggedCustomerInformation = AuthToken.parseToken(AuthToken.getToken());
            let loggedCustomerInformation = {};
            //get the logged customer if a customer is logged
            if(typeof AuthToken.getToken() == 'string'){
              var token = AuthToken.getToken();
              var route = AuthToken.parseToken(token).role==2?`${API.dev.customerRoute}`:`${API.dev.hairdresserRoute}`;
              Auth.getMe(route)
              .then((rep)=>{
                loggedCustomerInformation =rep;
                $log.debug(loggedCustomerInformation);
              },(err)=>{
                $log.error(err);
              });
            }
          /**
           * Get Hairdresser by id, (must be modified to get hairdresser by username)
           */
          this.getHairdresser = (id) =>{
            var self=this;
            Auth.getHairdresserById(id)
            .then(function ShowhairdresserprofileControllerSuccessCallback(response){
              $log.log('response ', response);
                 self.hairdresser = response;
            }, function ShowhairdresserprofileControllerFailureCallback(err){
                console.error(err);
            });
          };
          /**
           * 
           */
          this.getHairdresser(this._id);
          
          
            
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
         var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date(tomorrow);
          afterTomorrow.setDate(tomorrow.getDate() + 1);
        //events
        var events=[
                      {
                        date: tomorrow,
                        status: 'full'
                      },
                      {
                        date: afterTomorrow,
                        status: 'partially'
                      }
        ];
        //datapicker init date
        this.dt = new Date();
        //date picker option
        this.options = {
            customClass: function(data) {       
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') { 
              var dayToCheck = new Date(date).setHours(0,0,0,0);
              for (var i = 0; i < events.length; i++) {
                var currentDay = new Date(events[i].date).setHours(0,0,0,0);
                if (dayToCheck === currentDay) {
                  return events[i].status;
                }
              }
            }
            return '';
          },
            minDate: null, //Allow us to select date in the past 
            showWeeks: false,
            datepickerMode:'day'
      };
      var token = AuthToken.getToken();
      $scope.$watch('vm.dt',(newvalue, oldValue)=>{
        if( newvalue !== oldValue){
          token = AuthToken.getToken();
          if(typeof token != 'string'){ //check is a customer is connected
            this.displayModalAskingToLoggedin('sm');
          }else if(AuthToken.parseToken(token).role !=2){
              this.displayOnlyForCustomerModal('sm');
          }else if( AuthToken.parseToken(token).role ==2){
             if(newvalue< currentDay){
                    this.dateInThePastModal();                      
              }else{
                var tempObj = AuthToken.parseToken(token);
                console.log('parsed token ',tempObj);
                this.displayConfirmationModal(tempObj._id, tempObj.username, tempObj.firstname, tempObj.lastname);
              }
          }
        }//end if          
      });
        /**
         * Function used to display the login modal when the customer is not logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
           this.displayLoginModal = ()=>{
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'login.html',
                  controller: ModalInstanceCtrl,
                  controllerAs: 'vm',
                  size: 'sm'
                });
               }; //end displayLoginModal
       
        /**
         * Function used to display a modal asking for use to logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayModalAskingToLoggedin = ()=>{
            ModalFactory.trigger(this,'confirmation.html',function($uibModalInstance,topController){
                      this.ok = ()=>{
                        topController.displayLoginModal();
                        $uibModalInstance.close('cancel');
                        //$log.debug('clicked on the ok button');
                      };
                      this.cancel = ()=>{
                        //$log.debug('clicked on the cancel button');
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
        };
        /**
         * Confirmation Modal
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayConfirmationModal = (customerId,username,lastname,firstname)=>{
                  ModalFactory.trigger(this,'slot-confirmation.html',function($uibModalInstance,topController){
                    this.dt = topController.dt;
                    this.openingHourList = topController.openingHourList; 
                    this.showError=false;
                      this.ok = (index)=>{
                        if( index == undefined){
                          this.showError =true;
                        }else{
                              //topController.updateHairdresserAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index],customerId,username,lastname,firstname);
                              //topController.updateCustomerAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index], topController.hairdresser.username);
                              topController.updateHairdresserThenCustomerAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index],customerId,username,lastname,firstname, topController.hairdresser.username);
                            //$window.location.reload();
                           $uibModalInstance.close('cancel');
                        }                      
                      };
                      this.cancel = ()=>{
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
        };
        /**
         * [dateInThePastModal Modal displayed when a user slect a date in the pass]
         * @type {[type]}
         */
        this.dateInThePastModal = () =>{
          ModalFactory.trigger(this,'date-in-the-pass.html',function($uibModalInstance,topController){
            this.ok = ()=>{
              console.log('ok');
              $uibModalInstance.close('close');
            };
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
                        $uibModalInstance.dismiss('cancel');
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
                        $uibModalInstance.dismiss('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size
                });
               modalInstance.result.then(function () {
                 
                }, function (){
                 
                });
        };

      /**
       * [description]
       * @param  {[type]} hairdresserId       [description]
       * @param  {[type]} dayOfWeek           [description]
       * @param  {[type]} selectedHour        [description]
       * @param  {[type]} customerId          [description]
       * @param  {[type]} username            [description]
       * @param  {[type]} lastname            [description]
       * @param  {[type]} firstname           [description]
       * @param  {[type]} hairdresserUsername [description]
       * @return {[type]}                     [description]
       */
      this.updateHairdresserThenCustomerAppointment=(hairdresserId, dayOfWeek,selectedHour,customerId,username,lastname,firstname, hairdresserUsername)=>{
        var self= this;
        this.hairdresserMAnager.updateHairdresserAppointment(hairdresserId,dayOfWeek,selectedHour,customerId,username,lastname,firstname)
              .then((id)=>{
                 var deffered =this.$q.defer();
                 deffered.resolve(id);
                 return deffered.promise;
              })
              .then( (id)=>{
                this.customerMAnager.updateCustomerAppointment(id,hairdresserId,dayOfWeek, selectedHour,hairdresserUsername)
                .then(function updateAppointmentCustomerSlotControllerSuccessCallback(response){
                    if(response.success){
                      self.displayAppointmentConfirmationModal(true,dayOfWeek,selectedHour);
                    }
                },function updateAppointmentCustomerSlotControllerErrorCallback(err){
                    self.displayAppointmentConfirmationModal(false,dayOfWeek,selectedHour);
                    $log.error(err);
                });
              });
      };

      /**
       * [Modal displayed  at the end of an appointment registration process]
       * @param  {[type]} status       [registration status (success => true)]
       * @param  {[type]} selectedDay  [appointment day]
       * @param  {[type]} selectedHour [appoointment hour]
       * @return {[type]}              [description]
       */
      this.displayAppointmentConfirmationModal = (status, selectedDay,selectedHour)=>{
        $log.debug(' status ', status,'selectedHour ',selectedHour, 'selectedDay ',selectedDay);
        ModalFactory.trigger(this,'appointment-registration-confirmation.html', function($uibModalInstance, topController){
           $log.info('inside the confirmation success');
           this.isSuccess= status;
           this.selectedDay = selectedDay;
           this.selectedHour = selectedHour;
          this.ok = () =>{
              $uibModalInstance.close('close')
          }
        });
      };
        
}//end constructor
  
  

  

}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log','$uibModal','hairdresserMAnager','customerMAnager','ModalFactory','$q'];
export {ShowhairdresserprofileController};


