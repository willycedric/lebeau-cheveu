	class HairdresserbookingController {
	  constructor(bookings,Auth, API,$log,ModalFactory,hairdresserMAnager, customerMAnager,$q,$window,DateHandler) {
	  	// hairdressers account informations
	  	this.hairdresser={};
	  	this.openingHourList=API.dev.openingHourList;	  	 	
	  	this.ModalFactory = ModalFactory;
	  	this.$log = $log;
	  	this.$q = $q;
	  	this.hairdresserMAnager = hairdresserMAnager;
	  	this.customerMAnager = customerMAnager;
	  	this.$window=$window;
        this.DateHandler = DateHandler;    
      	

        var deserialize = (data)=>{
        	var defered = this.$q.defer();
        	defered.resolve(data.hairdresser);
        	return defered.promise;
        };

        var init = (data)=>{
        	deserialize(data)
        	.then((rep)=>{
	          this.hairdresser = rep;			  	        
	          this.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(this.hairdresser.appointments);
	        });

        };

        init(bookings);   

	};//end constructor;
	/**
	 * [displayConfirmationModal description]
	 * @param  {[type]} apt [description]
	 * @return {[type]}     [description]
	 */
	displayConfirmationModal(apt){
		var self =this;
		this.ModalFactory.trigger(self,'action-confirmation.html','custom', function($uibModalInstance,topController){
			this.apt=apt;
			this.message = 'Voulez vous annulez le rendez-vous du ' + (new Date(apt.appointmentDate)).toLocaleDateString()+' à '+apt.appointmentHour+' ?';
			 this.confirm = (apt)=>{
			 	topController.displayAppointmentCancelationModal(apt);
			 	$uibModalInstance.close('confirm');
			 };
			 this.cancel = ()=>{
			 	$uibModalInstance.dismiss('cancel');
			 };
		});
	};
	/**
	 * [displayAppointmentCancelationModal description]
	 * @param  {[type]} apt [description]
	 * @return {[type]}     [description]
	 */
	displayAppointmentCancelationModal(apt){
		var self=this;
        var aptDate = self.DateHandler.moment(apt.appointmentDate);
        var currentDate = self.DateHandler.moment(new Date());
		//aptDate.diff(currentDate,'days')<2
        if(false){//at least 48h are mandatory to cancel an appointment
            self.displayAppointmentDateToCloseModal(apt);
        }else{
                self.ModalFactory.trigger(self,'cancel-appointment.html','custom',function($uibModalInstance,topController){
                    var successMessage = 'Votre rendez vous du '+(new Date(apt.appointmentDate)).toLocaleDateString()+' à '+apt.appointmentHour+', a bien été supprimé !';
                    var errorMessage = 'Erreur lors de la suppression de votre rendez-vous, veuillez essayer ultérieurement.'
                    this.cancelAppointment = (reason)=>{
                    	topController.$log.debug('reason ', reason);
                        topController.hairdresserMAnager.updateAppointmentState(apt._id,-2)//-2 --> canceled by hairdresser
                        .then((rep)=>{
                            var defered = topController.$q.defer();
                            defered.resolve(rep);
                            return defered.promise;
                        })
                        .then((rep)=>{
                            topController.customerMAnager.updateAppointmentStateWithReason(apt._id, apt.customerId,reason,-2)//-2 --> canceled by hairdresser
                            .then((rep)=>{
                                topController.displaySuccessModal(rep.success,successMessage);
                            },(err)=>{
                                topController.displaySuccessModal(false,errorMessage);
                            })
                            .finally(()=>{
                                $uibModalInstance.close('done');
                            })
                        })
                    };
                    this.cancel = () =>{
                        $uibModalInstance.dismiss('cancel');
                    };
            });
        }
		
	};
        
     displayAppointmentDateToCloseModal(apt){
        var self = this;
        self.ModalFactory.trigger(self,'appointnment-date-close.html','custom',function($uibModalInstance,topController){
             this.message = 'vous ne pouvez pas annuler un rendez à moins de 48h. Votre rendez-vous est maintenu le '+new Date(apt.appointmentDate).toLocaleDateString();
            this.ok = () =>{
                $uibModalInstance.close('ok');
            };
        });
    };

	/**
	 * [displaySuccessModal description]
	 * @param  {[type]} state [description]
	 * @param  {[type]} msg   [description]
	 * @return {[type]}       [description]
	 */
	displaySuccessModal(state,msg){
		var self= this;
		this.ModalFactory.trigger(self,'success-modal.html','custom', function($uibModalInstance,topController){
			this.message =msg;
			this.isSuccess =state;
			this.ok = () =>{
				topController.$window.location.reload();
				$uibModalInstance.close('ok');
			};
		});
	};

	/**
	 * [getPendingAppointment description]
	 * @param  {[type]} appointments [description]
	 * @return {[type]}              [description]
	 */
	getPendingAppointment(appointments){
		let count=0;
		angular.forEach(appointments, (apt)=>{
			if(apt.appointmentState === -1){
				count++;
			}
		});
		console.log("Hairdresser pending appointment -->", count);
		return count;
	}
}
	HairdresserbookingController.$inject =['bookings','Auth','API', '$log', 'ModalFactory','hairdresserMAnager','customerMAnager','$q','$window','DateHandler'];
export {HairdresserbookingController};


