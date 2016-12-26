
import images from '../../../../images.json';
import {ModalInstanceCtrl} from './../login/modalCtrl';
class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope,AuthToken,$window,API,$log,$uibModal,hairdresserMAnager,customerMAnager,ModalFactory,$q,DateHandler){

            /**
             * Parameters definition
             */
             $scope.this =this;
             this.nbImages = 3;//images.length;
            this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1475226327/banner10_fdlxry.jpg"; 
            this._id = $stateParams.id;
            this.isCustomHeaderOpen =false;
            this.selectedTimeSlot = new Date();
            this.openingHourList= API.dev.openingHourList;
            this.hairdresserMAnager = hairdresserMAnager;
            this.customerMAnager= customerMAnager;
            this.Auth = Auth;
            this.$log =$log;
            this.$q = $q;
            this.DateHandler=DateHandler;
            this.ModalFactory =ModalFactory;
            this.$window = $window;
            this.API = API;
            this.$uibModal = $uibModal;
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
              },(err)=>{
                $log.error(err);
              });
            }
          
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
                this.displayConfirmationModal(tempObj._id, tempObj.username, tempObj.firstname, tempObj.lastname);
              }
               
          }
        }//end if          
      });    
          
}//end constructor
      /**
         * Function used to display the login modal when the customer is not logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
      displayLoginModal(){
          var self=this;
          var modalInstance = self.$uibModal.open({
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
        displayModalAskingToLoggedin(){
            var self=this;
            self.ModalFactory.trigger(self,'confirmation.html',function($uibModalInstance,topController){
                      this.ok = ()=>{
                        topController.displayLoginModal();
                        $uibModalInstance.close('ok');
                        //$log.debug('clicked on the ok button');
                      };
                      this.cancel = ()=>{
                        //$log.debug('clicked on the cancel button');
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
        }
        
        /**
         * [dateInThePastModal Modal displayed when a user slect a date in the pass]
         * @type {[type]}
         */
        dateInThePastModal(){
          var self=this;
          self.ModalFactory.trigger(self,'date-in-the-pass.html',function($uibModalInstance,topController){
            this.ok = ()=>{
              $uibModalInstance.close('close');
            };
          });
        }


        /**
         * [description]
         * @param  {[type]} dayOfWeek     [description]
         * @param  {[type]} index         [description]
         * @param  {[type]} appointmentId [description]
         * @param  {[type]} size          [description]
         * @return {[type]}               [description]
         */
        displayAlreadyReserved(dayOfWeek,index,appointmentId){
                  var self = this;
                  self.ModalFactory(self,'slot-reservation.html', function($uibModalInstance,topController){
                    this.selectedTimeSlot = dayOfWeek;
                    this.slotHour = self.openingHourList[index]; 
                    this.ok = ()=>{
                      $uibModalInstance.close('OK');
                    };

                    this.cancel = () =>{
                      $uibModalInstance.dismiss('cancel');
                    };
                  });
        }

        /**
         * [display a message wich inform that the logbook is only accessible to customer not hairdresser]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        displayOnlyForCustomerModal(size){
                var self =this;
                self.ModalFactory.trigger(self,'only-customer.html', function($uibModalInstance,topController){
                    this.ok = ()=>{
                                  $uibModalInstance.close('cancel');
                                  
                                };

                    this.cancel = ()=>{
                      $uibModalInstance.dismiss('cancel');
                    };
                  });
        }
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
      updateHairdresserThenCustomerAppointment(hairdresserId, dayOfWeek,selectedHour,customerId,username,lastname,firstname, hairdresserUsername){
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
      displayAppointmentConfirmationModal(status, selectedDay,selectedHour){
        var self =this;
        self.ModalFactory.trigger(self,'appointment-registration-confirmation.html', function($uibModalInstance, topController){
           this.isSuccess= status;
           this.selectedDay = selectedDay;
           this.selectedHour = selectedHour;
          this.ok = () =>{
              $uibModalInstance.close('close')
              topController.$window.location.reload();
          };
        });
      }; 
        /**
         * Confirmation Modal
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        displayConfirmationModal(customerId,username,lastname,firstname){
          var self = this;
          //check if the hairdresser has locked some days
          let tempDays = [];
          angular.forEach(self.hairdresser.lockedDays, (val, index)=>{
            var tempDate = self.DateHandler.moment(new Date(val));
            tempDays.push(tempDate.dayOfYear());
          });
          var appointmentDate = self.DateHandler.moment(self.dt); //date wishes for the appointment
          var currentDay = self.DateHandler.moment(new Date()); //current date
                  if(tempDays.indexOf(appointmentDate.dayOfYear()) != -1){
                    self.displayLockedAppointmentDetails(self.dt);
                  }
                  else if( appointmentDate.diff(currentDay, 'days') === 0){
                    self.displayNotTheSameDadyModal(); //prevent customer to book an hairdresser for the same day
                  }else{
                    self.ModalFactory.trigger(self,'slot-confirmation.html',function($uibModalInstance,topController){
                    this.dt = topController.dt;
                    topController.getAvailableSloteTimeForTheSelectedDay(this.dt)
                    .then((resp)=>{                      
                         this.openingHourList=topController.displayNoAvailableSlotModal(this.dt,resp);                         
                      });                  
                   
                      this.showError=false;
                      this.ok = (index)=>{
                        if( index == undefined){
                          this.showError =true;
                        }else{
                              topController.updateHairdresserThenCustomerAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index],customerId,username,lastname,firstname, topController.hairdresser.username);
                            //$window.location.reload();
                           $uibModalInstance.close('cancel');
                        }                      
                      };
                      this.cancel = ()=>{
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
                }                  
        };
  
  
   /**
    * [getAvailableSloteTimeForTheSelectedDay description]
    * @param  {[type]} selectedDay [description]
    * @return {[type]}             [description]
    */
  getAvailableSloteTimeForTheSelectedDay(selectedDay){
       var self=this;
       var result = self.$q.defer();
       self.Auth.getHairdresserById(self._id)
        .then( (resp)=>{
           var defered = self.$q.defer();
           defered.resolve(resp);
           return defered.promise;
        })
        .then((resp)=>{
          //Return the list of appointments days and hours
          var defered = self.$q.defer();
          var listOfAvailableHours=[];
          angular.forEach(resp.appointments, (appointment)=>{
            listOfAvailableHours.push({dayOfWeek: self.DateHandler.moment(appointment.dayOfWeek),hour:appointment.slotTime});
          });
          defered.resolve(listOfAvailableHours)
          return defered.promise;
        })
        .then((resp)=>{
            var tempHourList = []; 
            angular.copy(self.API.dev.openingHourList,tempHourList);
            angular.forEach(resp,(value, index)=>{
              if( value.dayOfWeek.diff( self.DateHandler.moment(selectedDay),'days') === 0){
                  tempHourList.splice(tempHourList.indexOf(value.hour),1);
                }
            });
            result.resolve(tempHourList);
        });
        return result.promise;
  };

  /**
  * Get Hairdresser by id, (must be modified to get hairdresser by username)
  */
  getHairdresser(id){
    var self=this;
    self.Auth.getHairdresserById(id)
    .then(function ShowhairdresserprofileControllerSuccessCallback(response){
         self.hairdresser = response;
    }, function ShowhairdresserprofileControllerFailureCallback(err){
        $log.error(err);
    });
  };

  /**
   * [displayNoAvailableSlotModal return a list of available slot for the selected day or display a modal if no slot available]
   * @param  {[type]} index             [description]
   * @param  {[type]} availableSlotList [description]
   * @param  {[type]} openingHourList   [description]
   * @return {[type]}                   [description]
   */
  displayNoAvailableSlotModal(date,availableSlotList){
      if(availableSlotList.length>0){
        return availableSlotList;      
      }else{
        this.noAvailableSlotModal(date);
      }
  }

  /**
   * [displayNotTheSameDadyModal Modal displayed when a customer attempt to book an hairdresser for the current day]
   * @return {[type]} [description]
   */
  displayNotTheSameDadyModal(){
    var self= this;
    self.ModalFactory.trigger(self,'not-same-day.html', function($uibModalInstance, topController){
      this.message = " Vous ne pouvez pas réserver un(e) coiffeuse/coiffeur à moins de 48h. Essayer d'envoyer un message privé."
      this.ok = () =>{
        $uibModalInstance.close('Ok');
      }
    });
  }

  /**
   * [noAvailableSlotModal display a modal informing the user there is no slot available for the selected day]
   * @return {[type]} [description]
   */
  noAvailableSlotModal(date){ 
      var self=this;
      self.ModalFactory.trigger(self,'novailable-slot.html', function($uibModalInstance,$uibModalStack, topController){
        this.date = date;
         $uibModalStack.dismissAll('close');
        this.ok = ()=>{
          $uibModalInstance.close();
        }
      });
  }

  /**
   * [displayLockedAppointmentDetails Modal displayed to inform a customer that a day has been locked]
   * @param  {[type]} date [description]
   * @return {[type]}      [description]
   */
   displayLockedAppointmentDetails(date){ 
      var self=this;
      self.ModalFactory.trigger(self,'lockedappointment-details.html', function($uibModalInstance, topController){
        this.date = date;
        this.hairdresserUsername = topController.hairdresser.username;
        this.ok = ()=>{
          $uibModalInstance.close('ok');
        }
      });
  }

  displayContactModal(){
    console.log("inside the contact modal");
  }

  

}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log','$uibModal','hairdresserMAnager','customerMAnager','ModalFactory','$q','DateHandler'];
export {ShowhairdresserprofileController};


