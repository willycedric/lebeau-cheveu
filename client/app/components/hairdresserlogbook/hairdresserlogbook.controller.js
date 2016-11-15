	import _ from 'lodash';
  class HairdresserlogbookController {
	  constructor(AuthToken,Auth,API,$log,$state,$uibModal,hairdresserMAnager,customerMAnager,$scope,ModalFactory, DateHandler,$q) {
	  	// hairdressers account informations
	  	
	  	this.hairdresser={};
	  	this.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
	  	this.days = [];
      this.times =[];
      this.$log = $log;
      this.$q =$q;
      this.contentLoaded=true;
      this.ModalFactory = ModalFactory;
      this.hairdresserMAnager = hairdresserMAnager; 
      this.customerMAnager=customerMAnager;
      const availableAppointmentDays=31; //Use to limit the datepicker to one month in order to prevent user to go to far in the future
	    this.dt = new Date();
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	    if(token){
	        this.username= AuthToken.parseToken(token).name;
	    }
      //this.log.debug('hairdresser',this.hairdresser);
      var events=[];
      var appointmentOfTheDay=[];
      Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
      .then((rep)=>{
          this.hairdresser = rep;
          //datepicker logic
         angular.forEach(this.hairdresser.appointments, (appt,key)=>{
           events.push({id:appt._id, date:appt.dayOfWeek, time:appt.slotTime, type:appt.slotType,state:appt.slotState,status: appt.slotType ==-1?'locked':'booked', relatedCustomer:appt.relatedCustomers})
        });
      });
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

      //Logic to handle hairdresser click on the logbook 
      $scope.$watch('vm.dt', (newValue, oldValue)=>{      
          if(newValue !== oldValue){
            appointmentOfTheDay=[];
            //checking if the selected date belongs to the hairdresser's appointment list
            angular.forEach(events, (apt,key)=>{
               if(DateHandler.isEqual(apt.date,newValue)){ //there is a date with an appointment
                  appointmentOfTheDay.push(apt);                   
               }
            });
            //check that the date picked contains appointments
            if(typeof appointmentOfTheDay !== undefined && appointmentOfTheDay.length>0){
               this.displayListOfAppointmentsOfTheSelectedDay(appointmentOfTheDay);
            }else{
              if(newValue < (new Date())){ //haidresser has selected an empty date in the past
                this.displayEmptyAppointmentInThePast(newValue);
              }else{ 
                this.displayEmptyAppointmentSlot(newValue);
              }              
            }           
          }
      });      
	};//end constructor;

  /**
   * [displayListOfAppointmentsOfTheSelectedDay display a modal with an appointment list for the slected day]
   * @param  {[type]} apt [description]
   * @return {[type]}     [description]
   */
  displayListOfAppointmentsOfTheSelectedDay(appointmentOfTheDay){
    var self= this;
      this.ModalFactory.trigger(self,'appointment-list.html', function($uibModalInstance,topController){
          this.appointmentOfTheDay = appointmentOfTheDay;

          this.appointmentDetails = (apt)=>{        
                  //check the appointment state 
                  if(apt.state === 0 && apt.type != -1){//hairdresser has not yet confirm the appointment and the appointment it's not locked
                    this.displayAppointmentConfirmationModal(apt); //prompt the hairdresser to confirm the appointment
                    
                  }else if(apt.state === -1 && apt.type != -1){ //hairdresser has already confirm the appointment and the appointment it's not locked
                    this.displayAppointmentReminderDetails(apt); //show the hairdresser information about this upcomming appointment
                    
                  }else if( apt.state === 1 && apt.type != -1){ //hairdresser has already accomplish the appointment and the appointment it's not locked
                    
                    this.displayAppointmentHistoryDetails(apt);//display informations related to the old appointment
                  }else if(apt.state === 0 && apt.type == -1){
                    this.displayAppointmentLockedDetails(apt);
                  }
               $uibModalInstance.close('child modal');
          };
          

          this.cancel = ()=>{
            $uibModalInstance.dismiss('cancel');
          };

          /**
           * [rompt the hairdresser to confirm the appointment]
           * @param  {[type]} apt [description]
           * @return {[type]}     [description]
           */
          this.displayAppointmentConfirmationModal = (apt)=>{
            self.displayAppointmentConfirmationModal(apt);
          };

          /**
           * [show the hairdresser information about this upcomming appointment]
           * @param  {[type]} apt [description]
           * @return {[type]}     [description]
           */
          this.displayAppointmentReminderDetails = (apt)=>{
            self.displayAppointmentReminderDetails(apt);
          };
          /**
           * [display informations related to the old appointment£`]
           * @param  {[type]} apt [description]
           * @return {[type]}     [description]
           */
          this.displayAppointmentHistoryDetails =(apt)=>{
            self.displayAppointmentHistoryDetails(apt);
          };

          /**
           * [display informations about a locked date&time period]
           * @param  {[type]} apt [description]
           * @return {[type]}     [description]
           */
          this.displayAppointmentLockedDetails = (apt)=>{
            self.displayAppointmentLockedDetails(apt);
          };
 

      });
  }

  /**
   * [displayAppointmentConfirmationModal display a list of modal depending of the appointment state]
   * @param  {[type]} apt [description]
   * @return {[type]}     [description]
   */
  displayAppointmentConfirmationModal(apt){
    var self= this;
    this.ModalFactory.trigger(self,'appointmentconfirmation.html', function($uibModalInstance, topController){

      this.apt = apt;
       const updateConfirmationMessage = 'Le rendez-vous a bien été enregistré !';
       const deletionConfirmationMessage = 'Le rendez-vous a bien été supprimé !';
      /**
       * [update the hairdresser booking and send a notification to the  related customer]
       * @return {[type]} [description]
       */
      this.ok = () =>{
          //updating hairdresser booking
          topController.hairdresserMAnager.updateHairdresserBooking(apt)
          .then((rep)=>{ //update hairdresser booking 
            var deferred = topController.$q.defer();
            if(rep.success){
              deferred.resolve(rep.success);
            }else{
              deferred.reject( new Error(''));
            }
            return deferred.promise;
            })
            .then((rep)=>{ //on hairdresser booking success, update customer booking
                topController.customerMAnager.updateCustomerAppointmentState(apt.id,apt.relatedCustomer._id)
                .then((rep)=>{                  
                    topController.displayConfirmationModal(rep.success,updateConfirmationMessage);
                  
                });
            })
            .finally(()=>{
               $uibModalInstance.close('ok');
            });
          //updating customer booking
         
      };//ok
      /**
       * [delete an appointment and send a notification to the related customer]
       * @return {[type]} [description]
       */
      this.decline = () =>{
        topController.hairdresserMAnager.removeHairdresserAppointement(apt.id)
        .then((rep)=>{
            var deferred = topController.$q.defer();
            if(rep.success){
              //self.displayConfirmationModal(rep.success,deletionConfirmationMessage);
              deferred.resolve(rep.success);
            }else{
              deferred.resolve(new Error(''));
            }
            return deferred.promise;
        })
        .then((rep)=>{
              topController.customerMAnager.removeCustomerAppointmentAndNotify(apt.id,apt.relatedCustomer._id)
              .then((rep)=>{
                topController.displayConfirmationModal(rep.success,deletionConfirmationMessage);
              });
        })
        .finally(()=>{
          $uibModalInstance.close('decline');
        })
         
      }; //end decline
      
      this.back = ()=>{
        $uibModalInstance.dismiss('back');
      };//end back
    });
  }

/**
 * [displayConfirmationModal  display confirmation with a custom content]
 * @param  {[type]} status  [action status (false/true)]
 * @param  {[type]} message [modal content]
 */
displayConfirmationModal(status,message){
  var self=this;
  this.ModalFactory.trigger(self,'appointment-update-confirmation.html', function($uibModalInstance,topController){
    this.isSuccess=status;
    this.message =message;
    this.ok=()=>{
      $uibModalInstance.close('ok');
    };
  });
}

/**
 * [displayAppointmentReminderDetails Display appointment details]
 * @param  {[type]} apt [description]
 * @return {[type]}     [description]
 */
displayAppointmentReminderDetails(apt){
  var self= this;
  this.ModalFactory.trigger(self,'appointment-details.html', function($uibModalInstance,topController){
    this.apt= apt;
    this.ok = ()=>{
      $uibModalInstance.close('ok');
    };
  });
};

/**
 * [displayAppointmentHistoryDetails Display past appoitment details]
 * @param  {[type]} apt [appointment object]
 */
displayAppointmentHistoryDetails(apt){
  var self= this;
  this.ModalFactory.trigger(self,'appointment-history.html', function($uibModalInstance, topController){
    this.apt= apt;
    this.ok = () =>{
      $uibModalInstance.close('ok');
    };
  })
};

/**
 * [displayEmptyAppointmentSlot display a modal allowing the hairdresser to locked a date&time period]
 * @param  {[type]} date [date locked]
 */
displayEmptyAppointmentSlot(date){
  var self= this;
  this.ModalFactory.trigger(this,'lockedappointment.html', function($uibModalInstance, topController){
    this.date = date;
    this.openingHourList= topController.openingHourList;
    this.showError=false;
    //If the hairdresser decide to locked a date/time period
    this.confirm = (selectedHour)=>{
      if(selectedHour == undefined){
        this.showError = true;
      }else{
        var confirmationMessage = 'La période du '+date.toLocaleDateString()+' à'+this.openingHourList[selectedHour]+', à bien été réservée';
        var errorMessage = 'Erreur lors de la procédure de réservation. Veuillez essayer ultérieurement.'
        topController.hairdresserMAnager.lockedHairdresserTimeSlot(date,this.openingHourList[selectedHour])
        .then((rep)=>{
            topController.displayConfirmationModal(rep.success,confirmationMessage);
        }, (err)=>{
          topController.displayConfirmationModal(false,errorMessage);
        })
        .finally(()=>{
          $uibModalInstance.close('resolved');
        });
      }
   };
    //cancel
    this.back = ()=>{
      $uibModalInstance.dismiss('back');
    }
  });
}

/**
 * [displayEmptyAppointmentInThePast display a modal informing the hairdresser that the appointment date is on the past]
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
displayEmptyAppointmentInThePast(date){
    var self=this;
    this.ModalFactory.trigger(self,'date-in-the-pass.html',function($uibModalInstance,topController){
      this.date = date;
      this.ok = ()=>{
        $uibModalInstance.close('close');
      };
    });
};

/**
 * [displayAppointmentLockedDetails display a modal showing information about the locked date&time period]
 * @param  {[type]} apt [appointment object]
 */
displayAppointmentLockedDetails(apt){
  this.ModalFactory.trigger(self,'appointment-locked.html',function($uibModalInstance, topController){
    this.apt= apt;
    this.confirm = ()=>{
      $uibModalInstance.close('confirm');
    };
  })
};



}//end class
HairdresserlogbookController.$inject =['AuthToken','Auth','API','$log','$state','$uibModal','hairdresserMAnager','customerMAnager','$scope','ModalFactory','DateHandler','$q'];

export {HairdresserlogbookController};


