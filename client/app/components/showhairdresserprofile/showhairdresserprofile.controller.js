
import images from '../../../../images.json';
import {ModalInstanceCtrl} from './../login/modalCtrl';
class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope,AuthToken,$window,API,$log,$uibModal,hairdresserMAnager,customerMAnager,ModalFactory,$q,DateHandler,securityAuthorization,security,accountResource){

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
            this.events=[];
            this.$uibModal = $uibModal;         
            this.securityAuthorization = securityAuthorization;
            this.mode="month";
            this.listOfAvailableCategories = [{
              categoryName:[],
              galeryEntries:[]             
            }];
            //current date for the calendar
            this.today = ()=>{
              this.currentDate = new Date();
            };
            this.isToday =  ()=> {
                var today = new Date(),
                    currentCalendarDate = new Date(this.currentDate);

                today.setHours(0, 0, 0, 0);
                currentCalendarDate.setHours(0, 0, 0, 0);
                return today.getTime() === currentCalendarDate.getTime();
            };
            //event selection
            this.onEventSelected = (event)=>{
              console.log('event selected',event);
            }

            
            //default selected category which is displayed when the view is loaded
            this.selectedCategory = null;
            this.rating =0;
            this.accountResource=accountResource;
            this.$stateParams = $stateParams;          
            const currentDay = new Date();
            //let loggedCustomerInformation = AuthToken.parseToken(AuthToken.getToken());
          
          /**
           * 
           */
          this.getHairdresser(this._id);                  
          

        /**
         * Logbook cell management logic
         */
         var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date(tomorrow);
          afterTomorrow.setDate(tomorrow.getDate() + 1);
       
       
      var appointmentOfTheDay=[];
      //time selected
            this.onTimeSelected = (selectedTime, events)=>{              
              var self = this;
                console.log('Selected time: ' + selectedTime + ' hasEvents: ' + (events !== undefined && events.length !== 0),'events',events);
                // if(self.isToday()){
                //   alert('is today');
                // }
                this.dt = selectedTime;
                security.requestCurrentUser()
                .then((rep)=>{
                    if(true){
                      if(rep==null){
                        this.displayModalAskingToLoggedin('sm');
                      }else if(!rep.account){ //check if the connected user is a customer
                        this.displayOnlyForCustomerModal('sm');
                      }else if(rep.account){
                        if(self.DateHandler.moment( new Date()).diff(self.DateHandler.moment(selectedTime))>0){
                              this.dateInThePastModal();                      
                        }else{
                          this.accountResource.getAccountDetails()
                          .then((customer)=>{                                                
                                this.displayConfirmationModal(customer.account.locations,selectedTime,events);                    
                          });
                                        
                        }
                      }
                    }//end if
                });          
            }
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
            self.ModalFactory.trigger(self,'confirmation.html','custom',function($uibModalInstance,topController){
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
          self.ModalFactory.trigger(self,'date-in-the-pass.html','custom',function($uibModalInstance,topController){
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
                  self.ModalFactory(self,'slot-reservation.html','custom', function($uibModalInstance,topController){
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
                self.ModalFactory.trigger(self,'only-customer.html','custom',function($uibModalInstance,topController){
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
      updateHairdresserThenCustomerAppointment(hairdresserId, dayOfWeek,selectedHour,hairdresserUsername,locationIndex){
        var self= this;
        this.hairdresserMAnager.updateHairdresserAppointment(hairdresserId,dayOfWeek,selectedHour,locationIndex)
              .then((id)=>{
                 var deffered =this.$q.defer();
                 deffered.resolve(id);
                 return deffered.promise;
              })
              .then( (id)=>{
                this.customerMAnager.updateCustomerAppointment(id,hairdresserId,dayOfWeek, selectedHour,hairdresserUsername,locationIndex)
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
        self.ModalFactory.trigger(self,'appointment-registration-confirmation.html','custom', function($uibModalInstance, topController){
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
        displayConfirmationModal(locations,selectedTime,events){
          var self = this;
          //check if the hairdresser has locked some days
          let hairdresserLockedDays = [];
          angular.forEach(self.hairdresser.appointments, (val, index)=>{
            if(!val.hasOwnProperty('slotTime') && val.slotType==-1){
               var tempDate = self.DateHandler.moment(new Date(val.dayOfWeek));
                hairdresserLockedDays.push(tempDate.dayOfYear());
            }
          });
          var appointmentDate = self.DateHandler.moment(selectedTime); //date wishes for the appointment
          var currentDay = self.DateHandler.moment(new Date()); //current date
                  if(hairdresserLockedDays.indexOf(appointmentDate.dayOfYear()) != -1){
                    self.displayLockedAppointmentDetails(selectedTime);
                    return "";
                  }
                  else if( appointmentDate.diff(currentDay, 'days') === 0){
                    self.displayNotTheSameDadyModal(); //prevent customer to book an hairdresser for the same day
                    return "";
                  }else{
                    self.ModalFactory.trigger(self,'slot-confirmation.html','custom',function($uibModalInstance,topController){
                    this.dt = topController.dt;
                    topController.getAvailableSloteTimeForTheSelectedDay(selectedTime)
                    .then((resp)=>{ 
                                       
                         this.openingHourList=topController.displayNoAvailableSlotModal(selectedTime,resp);                         
                      });                  
                   
                      this.showError=false;
                      this.ok = (index)=>{
                        if( index == undefined){
                          this.showError =true;
                        }else{
                              //When there is more than one location registered prompt the user to choose for his/her appointment location then send the location index
                              //to the function in charge to store the appointment in the hairdresser and customer model.                              
                              if( locations.length > 1){
                                topController.displayLocationSelectionModal(topController.$stateParams.id,selectedTime,this.openingHourList[index],topController.hairdresser.name,locations);
                              }else{
                                // when there is just one location registered send the location index=0 to the handlers functions
                                topController.updateHairdresserThenCustomerAppointment(topController.$stateParams.id,selectedTime,this.openingHourList[index],topController.hairdresser.name,locations);
                              }
                              
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
          defered.resolve(listOfAvailableHours);
          return defered.promise;
        })
        .then((resp)=>{
            var tempHourList = []; 
            angular.copy(self.API.dev.openingHourList,tempHourList);
            if(resp.length>0){
              angular.forEach(resp,(value, index)=>{
              if( value.dayOfWeek.diff( self.DateHandler.moment(selectedDay),'days') === 0){
                  tempHourList.splice(tempHourList.indexOf(value.hour),1);
                  }
              });
              result.resolve(tempHourList);
            }else if((resp!=null) && (resp.length == 0)){              
              result.resolve(self.API.dev.openingHourList);
            }else{
             result.reject(new Error("the list of available hours : "+err.toString()));
            }
            
        }, (err)=>{
            throw new Error(err.toString());
        });
        return result.promise;
  };

  /**
  * Get Hairdresser by id, (must be modified to get hairdresser by username)
  */
  getHairdresser(id){
    var self=this;
    self.Auth.getHairdresserById(id)
    .then((response)=>{      
         self.hairdresser = response;
         self.rating = self.hairdresser.rating;
         console.log(JSON.stringify(self.hairdresser.rating));
         var data ={
           categoryName:[],
           galeryEntries:[]
         };
         angular.forEach(self.hairdresser.categories,(category, ind)=>{
            data.categoryName.push(category.name);
            angular.forEach(self.hairdresser.gallery_pictures, (elt)=>{          
                if(angular.equals(elt.category.toString(), category._id.toString())&& elt.published){
                  data.galeryEntries.push({url:elt.url});
                }
            });
            if(!!self.listOfAvailableCategories[ind]){
                self.listOfAvailableCategories.push(data);
            }
             data ={
                categoryName:[],
                galeryEntries:[]
              };
          });
          self.listOfAvailableCategories = self.listOfAvailableCategories.slice(1);       
          self.selectedCategory = self.listOfAvailableCategories[0].categoryName[0];               
        angular.forEach(self.hairdresser.appointments, (appt,key)=>{
            //self.events.push({id:appt._id, date:appt.dayOfWeek, startTime:appt.slotTime, type:appt.slotType,state:appt.slotState,status: appt.slotState==0?'booked':(appt.slotState==-1?'pending':(appt.slotType===-1?'locked':'free')), relatedCustomer:appt.relatedCustomers,allDay:false});
            if(appt.slotType!=-1 && appt.hasOwnProperty('slotTime')){
                self.events.push({
                id:appt._id, 
                startTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(parseInt(appt.slotTime.split('h')[0]),'hours').toDate() , 
                endTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(parseInt(appt.slotTime.split('h')[0])+3,'hours').toDate(),
                type:appt.slotType,
                state:appt.slotState,
                status: appt.slotState==0?'booked':(appt.slotState==-1?'pending':(appt.slotType===-1?'locked':'free')),
                relatedCustomer:appt.relatedCustomers,
                allDay:false
              });
            }              
            else if(appt.slotType==-1){
               self.events.push({
                id:appt._id, 
                startTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(1, 'hours').toDate(), 
                endTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(24,'hours').toDate(),               
                type:appt.slotType,
                state:appt.slotState,
                status: 'locked',                
                allDay:false
              });
            }else{
              throw new Error(" no slot time available");
            }              
            
        });  
          console.log("events array struct ",self.events);
          self.eventSource = self.events;
    })
    .finally(()=>{
        //  this.defineCalendarOption()
        //  .then(()=>{
        //     this.loadLogbook=true;
        //   });          
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
    self.ModalFactory.trigger(self,'not-same-day.html', 'custom',function($uibModalInstance, topController){
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
      self.ModalFactory.trigger(self,'novailable-slot.html','custom', function($uibModalInstance,$uibModalStack, topController){
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
      self.ModalFactory.trigger(self,'lockedappointment-details.html','custom', function($uibModalInstance, topController){
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



/**
 * [displayLocationSelectionModal Prompt the user to select the appointment location when there is more than one location
 * registered in the customer profile informations]
 * @param  {[ObjectID]} hairdresserId       [hairdresser id]
 * @param  {[date]} dayOfWeek           [selected day of week]
 * @param  {[int]} selectedHour        [selected time slot]
 * @param  {[string]} hairdresserUsername [hairdresser user name]
 * @param  {[Object]} locations           [customer locations]
 * @return {[N/A]}                     [N/A]
 */
displayLocationSelectionModal(hairdresserId,dayOfWeek,selectedHour,hairdresserUsername,locations){
  var self = this;
  self.ModalFactory.trigger(self, 'location-selection.html','custom', function($uibModalInstance,topController){

    this.message = "Veuillez sélectionner le lieux de rendez-vous.";
    this.locations = locations;

    this.ok = (selectedLocation)=>{
        topController.updateHairdresserThenCustomerAppointment(hairdresserId,dayOfWeek,selectedHour,hairdresserUsername,selectedLocation);
        $uibModalInstance.close('ok');
    };

    this.cancel = ()=>{
      $uibModalInstance.dismiss('cancel');
    };

  })
};



}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log','$uibModal','hairdresserMAnager','customerMAnager','ModalFactory','$q','DateHandler','securityAuthorization','security','accountResource'];
export {ShowhairdresserprofileController};


