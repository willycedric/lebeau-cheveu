class AccountbookingController {
	  constructor(Auth,API,ModalFactory,$log,$q,hairdresserMAnager,customerMAnager,DateHandler,details) {
	 
    this.Auth = Auth;
    this.API =API;
    this.ModalFactory =ModalFactory;
    this.$log=$log;
    this.$q = $q;
    this.customerMAnager=customerMAnager;
    this.hairdresserMAnager=hairdresserMAnager;
     this.DateHandler= DateHandler;

	 	//while the user still connected the token is available from the local storage	
     	//this.refreshAccountProfile(this,token);        
		var self=this;
		var deserialize = (data)=>{
			self.customer = data.account;
			
		}

		deserialize(details);
	};//end constructor;
	/**
	 * [displayConfirmationModal display a confirmation modal]
	 * @param  {[type]} appointment [description]
	 * @return {[type]}             [description]
	 */
	displayConfirmationModal(appointment){
		var self=this;
		this.ModalFactory.trigger(self,'action-confirmation.html','custom', function($uibModalInstance,topController){           
			this.apt=appointment;
			this.message = 'Voulez vous annulez le rendez-vous du ' + (new Date(appointment.dayOfWeek)).toLocaleDateString()+' à '+appointment.selectedHour+' ?';
			 this.confirm = (apt)=>{
			 	topController.displayAppointmentCancelationModal(apt);
			 	$uibModalInstance.close('confirm');
			 };
			 this.cancel = ()=>{
			 	$uibModalInstance.dismiss('cancel');                
              
			 };
		}); 
	}

	/**
	 * [displayAppointmentCancelationModal description]
	 * @param  {[type]} apt [description]@
	 * @return {[type]}     [description]
	 */
	displayAppointmentCancelationModal(apt){
		var self=this;
        var currentDate = self.DateHandler.moment(new Date());
        var aptDate = self.DateHandler.moment(apt.dayOfWeek);
        if(aptDate.diff(currentDate,'days')<1){ //is the date is too close from the appointment date display a modal
            self.displayAppointmentDateToCloseModal(apt);
        }else{
                self.ModalFactory.trigger(self,'cancel-appointment.html','custom', function($uibModalInstance,topController){
                var successMessage = 'Votre rendez vous du '+(new Date(apt.dayOfWeek)).toLocaleDateString()+' à '+apt.selectedHour+', a bien été supprimé !';
                var errorMessage = 'Erreur lors de la suppression du rendez-vous, essayer ultérieurement'
                var state=-3; //cancel by the account 
                this.cancelAppointment = (reason)=>{
                    topController.customerMAnager.updateAppointmentState(apt._id,state)
                    .then((rep)=>{
                        var defered = topController.$q.defer();
                        defered.resolve(rep);
                        return defered.promise;
                    })
                    .then((rep)=>{
                        topController.hairdresserMAnager.updateAppointmentStateWithReason(apt._id, apt.haidresserId,reason,state)
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
        self.ModalFactory.trigger(self,'appoitnment-date-close.html','custom',function($uibModalInstance,topController){
             this.message = 'vous ne pouvez pas annuler un rendez à moins de 24h. Votre rendez-vous est maintenu le '+new Date(apt.dayOfWeek).toLocaleDateString();
            this.ok = () =>{
                $uibModalInstance.close('ok');
            };
        });
    };
	/**
	 * [displaySuccessModal description]
	 * @param  {[type]} state   [description]
	 * @param  {[type]} message [description]
	 * @return {[type]}         [description]
	 */
	displaySuccessModal(state,message){
		var self=this;
		this.ModalFactory.trigger(self,'confirmation-modal.html','custom', function($uibModalInstance, topController){
			this.message= message,
			this.isSuccess=state;
			this.ok = () =>{
				$uibModalInstance.close('close');
			};
		})
	}
	/**
	 * [getUnreadNotification return the number of unread notification]
	 * @param  {[type]} account [description]
	 * @return {[type]}          [description]
	 */
	getUnreadAccountNotification(notifications){
		let count=0;
		angular.forEach(notifications, (notif)=>{
			if(!notif.read){
				count++;
			}
		});
		return count;
	}

	/**[getPendingAppointment Functiona allowing  to get the number of pending appointment]
	 * @param  {[type]} appointments [description]
	 * @return {[type]}              [description]
	 */
	getPendingAppointment(appointments){		
		let count=0;
		angular.forEach(appointments, (apt)=>{
			if(apt.appointmentState == 0){
				count++;
			}
		});
		return count;
	}

}//end class

AccountbookingController.$inject =['Auth','API','ModalFactory','$log','$q','hairdresserMAnager','customerMAnager','DateHandler','accountDetails'];

export {AccountbookingController};


