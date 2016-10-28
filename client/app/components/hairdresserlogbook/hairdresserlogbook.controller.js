	class HairdresserlogbookController {
	  constructor(AuthToken,Auth,Access,API,$log,$state,$uibModal,hairdresserMAnager) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.hairdresser={};
	  	self.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
	  	self.days = [];
        self.times =[];

	  	
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	    if(token){
	        this.username= AuthToken.parseToken(token).name;
	    }

	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
	    .then(function HairdresserControllerGetProfileSuccessCallback (response){
	    		self.hairdresser= response;
	    		angular.forEach(response.appointments,function(resp,key){
                    self.days.push(resp.dayOfWeek);                  
                    self.times[key] = [];
                    self.times[key].push(resp.slotTime);           
                });
	    }, function HairdresserControllerGetProfileErrorCallback(err){

	    });



	    /**
	     * [Launch the appropriate modal according to the slot state]
	     * @param  {[type]} dayOfWeek [Appointment day]
	     * @param  {[type]} index     [index of the appointment in the day]
	     * @param  {[type]} slotType  [slot type (empty or reserved or locked)]
	     * @return {[type]}           [description]
	     */
	    self.rowClicked =(dayOfWeek,appointmentId,index,slotType) => {
	    	$log.debug(slotType);
	    	if( slotType == 1){
	    		self.viewAppointmentModal(dayOfWeek,appointmentId,index,slotType);
	    	}else if(slotType == 0){
	    		self.viewEmptyAppointmentSlotModal(dayOfWeek,appointmentId,index,slotType);
	    	}else if (slotType == -1){
	    		self.viewLockedAppointmentSlotModal(dayOfWeek,appointmentId,index,slotType);
	    	}
	    };


	    /**
	     * [View the appoitment slot details, customer information, day and hours]
	     * @param  {[type]} size      [modal size]
	     * @param  {[type]} dayOfWeek [Appointment day]
	     * @param  {[type]} appointmentId [Appointment id]
	     * @param  {[type]} index     [index of the appointment in the day]
	     * @param  {[type]} slotType  [slot type (empty or reserved or locked)]
	     * @return {[type]}           [description]
	     */
	    self.viewAppointmentModal = (dayOfWeek,appointmentId,index,slotType)=>{
	    		var topCtrl = self;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'appointment.html',
                  controller: function($uibModalInstance,self){
                  		var $ctrl = this;
                  		$ctrl.dayOfWeek = dayOfWeek;
                  		$ctrl.appointmentHour = self.openingHourList[index];
                  		$ctrl.appointment = {};

                  		//Get the appointment based on it's Id
                  		hairdresserMAnager.getAppointmentById(appointmentId)
                  		.then((rep)=>{
                  			//Getting customer informations
                  			$ctrl.customerUsername = rep.relatedCustomers[index].customerUsername;
                  			$ctrl.customerLastName = rep.relatedCustomers[index].customerLastName;
                  			$ctrl.customerFirstName =rep.relatedCustomers[index].customerFirstName;
                  			$ctrl.dayOfWeek =rep.dayOfWeek;
                  			$ctrl.customerLocation = rep.relatedCustomers[index].customerLocation;

                  			$log.debug('$ctrl.customerUsermane ', $ctrl.customerUsermane,'rep ',rep)
                  		},(err)=>{
                  			$log.error(err);
                  		});

                  		
                  		$ctrl.ok = ()=>{
                  			$log.debug('Confirmer');
                  			$uibModalInstance.close('ok');
                  			//Sending the confirmed appointment to the hairdresser booking array
                  			hairdresserMAnager.updateHairdresserBooking($ctrl.customerFirstName, $ctrl.customerLastName, $ctrl.dayOfWeek,$ctrl.appointmentHour, $ctrl.customerLocation)
                  			.then((rep)=>{
                  				//display a confirmation modal in case of success
                  				self.confirmAppointmentModal($ctrl.dayOfWeek,$ctrl.appointmentHour);
                  			}, (err)=>{
                  				//display a confirmation modal in case of error
                  				self.errorAppointmentModal();
                  			});
                  		};
                  		$ctrl.cancel = ()=>{
                  			/*$uibModalInstance.dismiss('dismiss');*/
                  			//Removing the appointment form the hairdresser appointments array
                  			hairdresserMAnager.removeHairdresserAppointement(appointmentId)
                  			.then((rep)=>{
                  				//display a confirmation modal in case of success
                  				self.removeAppointmentConfirmationModal($ctrl.dayOfWeek, $ctrl.appointmentHour);
                  			}, (err)=>{
                  				//display a confirmation modal in case of error
                  				self.removeAppointmentErrorModal();
                  			})
                  			$log.debug('Annuler');
                  			$uibModalInstance.close('annuler');
                  		}
                  		$ctrl.back = () =>{
                  			$uibModalInstance.dismiss('dismiss');
                  		}
                  },
                  controllerAs: '$ctrl',
                  size: 'sm',
                  resolve: {
                    self: function () {
                      return  topCtrl;
                    }
                  }
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Appointment Modal dismissed at: ' + new Date());
                });
	    }; // end viewAppointmentModal

	    
	    /**
	     * [View an empty appointment slot details and allow the hairdresser to locked it]
	     * @param  {[type]} size      [modal size]
	     * @param  {[type]} dayOfWeek [Appointment day]
	     * @param  {[type]} appointmentId [Appointment id]
	     * @param  {[type]} index     [index of the appointment in the day]
	     * @param  {[type]} slotType  [slot type (empty or reserved or locked)]
	     * @return {[type]}           [description]
	     */
	    self.viewEmptyAppointmentSlotModal = (dayOfWeek,appointmentId,index,slotType)=>{
	    		  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'emptyappointment.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  		$ctrl.cancel = ()=>{
                  			$uibModalInstance.dismiss('dismiss');
                  		}
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                 /* resolve: {
                    items: function () {
                      return  self.message;
                    }
                  }*/
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Empty Appointment Modal dismissed at: ' + new Date());
                });
	    }; // end viewEmptyAppointmentModal


	    /**
	     * [View an empty appointment slot details and allow the hairdresser to locked/unlocked it]
	     * @param  {[type]} size      [modal size]
	     * @param  {[type]} dayOfWeek [Appointment day]
	     * @param  {[type]} appointmentId [Appointment id]
	     * @param  {[type]} index     [index of the appointment in the day]
	     * @param  {[type]} slotType  [slot type (empty or reserved or locked)]
	     * @return {[type]}           [description]
	     */
	    self.viewLockedAppointmentSlotModal = (dayOfWeek,appointmentId,index,slotType)=>{
	    	var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'lockedappointment.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  		$ctrl.cancel = ()=>{
                  			$uibModalInstance.dismiss('dismiss');
                  		}
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                 /* resolve: {
                    items: function () {
                      return  self.message;
                    }
                  }*/
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Locked Appointment Modal dismissed at: ' + new Date());
                });
	    }; //end veiwLockedAppointmentModal


	    /**
	     * Display a confirmation modal when the hairdresser has confirmed an appointment
	     * @param {[type]} [dayofWeek] [appointment day]
	     * @param {[type]} [appointmentHour] [appointment Hour]
	     * @return {[type]} [description]
	     */
	    self.confirmAppointmentModal = (dayOfWeek, appointmentHout) =>{
	    	var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'appointmentconfirmation.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.dayOfWeek = dayOfWeek;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                });
	    }; // end confirmAppointmentModal

	    /**
	     * Functiona allowing to display a modal when the appointment confirmation query can't be successfully applied
	     * @return {[type]} [description]
	     */
	    self.errorAppointmentModal = () =>{
	    	var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'errorconfirmation.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                });
	    }; // end errorAppointmentModal

	    /**
	     * Function allowing to display a confirmation modal when an appointment has been canceled
	     * @param  {[type]} dayOfWeek [appointment day]
	     * @param { {[type]}} appointmentHour [appointment hour]
	     * @return {[type]}           [description]
	     */
	    self.removeAppointmentConfirmationModal = (dayOfWeek, appointmentHour)=>{
	    	var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'removeAppointmentmodal.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.dayOfWeek = dayOfWeek;
                  		$ctrl.appointmentHour = hour;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                });
	    };//end removeAppointmentConfirmationModal

	    self.removeAppointmentErrorModal = () =>{
	    	var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'removeAppointmenterrormodal.html',
                  controller: function($uibModalInstance){
                  		var $ctrl = this;
                  		$ctrl.ok = ()=>{
                  			$uibModalInstance.close('ok');
                  		};
                  },
                  controllerAs: '$ctrl',
                  size: 'sm'
                });
	    }; //end removeAppointmentErrorModal

	};//end constructor;

}
HairdresserlogbookController.$inject =['AuthToken','Auth','Access','API','$log','$state','$uibModal','hairdresserMAnager'];

export {HairdresserlogbookController};


