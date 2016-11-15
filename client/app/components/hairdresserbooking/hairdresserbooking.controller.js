	class HairdresserbookingController {
	  constructor(Auth, API,$log,ModalFactory,hairdresserMAnager, customerMAnager,$q) {
	  	// hairdressers account informations
	  	this.hairdresser={};
	  	this.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];	  	 	
	  	this.ModalFactory = ModalFactory;
	  	this.$log = $log;
	  	this.$q = $q;
	  	this.hairdresserMAnager = hairdresserMAnager;
	  	this.customerMAnager = customerMAnager;
	    Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
      	.then((rep)=>{
          this.hairdresser = rep;
          this.count = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(this.hairdresser.appointments);
        });
   

	};//end constructor;
	/**
	 * [displayConfirmationModal description]
	 * @param  {[type]} apt [description]
	 * @return {[type]}     [description]
	 */
	displayConfirmationModal(apt){
		var self =this;
		this.ModalFactory.trigger(self,'action-confirmation.html', function($uibModalInstance,topController){
			this.apt=apt;
			this.message = 'Voulez vous annulez le rendez-vous du ' + (new Date(apt.appointmentDate)).toLocaleDateString()+' à '+apt.appointmentHour+' ?';
			 this.confirm = (apt)=>{
			 	topController.displayAppointmentCancelationModal(apt);
			 	$uibModalInstance.close('confirm');
			 };
			 this.cancel = ()=>{
			 	$uibModalInstance.dismiss('cancel');
			 };
		})
	};
	/**
	 * [displayAppointmentCancelationModal description]
	 * @param  {[type]} apt [description]
	 * @return {[type]}     [description]
	 */
	displayAppointmentCancelationModal(apt){
		var self=this;
		self.ModalFactory.trigger(self,'cancel-appointment.html', function($uibModalInstance,topController){
			var successMessage = 'Votre rendez vous du '+(new Date(apt.appointmentDate)).toLocaleDateString()+' à '+apt.appointmentHour+', a bien été supprimé !';
			var errorMessage = 'Erreur lors de la suppression du rendez-vous, essayer ultérieurement'
			this.cancelAppointment = (reason)=>{
				topController.$log.debug('reason ',reason);
				topController.hairdresserMAnager.deleteHairdresserBooking(apt._id)
				.then((rep)=>{
					var defered = topController.$q.defer();
					defered.resolve(rep);
					return defered.promise;
				})
				.then((rep)=>{
					topController.customerMAnager.removeCustomerAppointmentWithReason(apt._id, apt.customerId,reason)
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
	};

	/**
	 * [displaySuccessModal description]
	 * @param  {[type]} state [description]
	 * @param  {[type]} msg   [description]
	 * @return {[type]}       [description]
	 */
	displaySuccessModal(state,msg){
		var self= this;
		this.ModalFactory.trigger(self,'success-modal.html', function($uibModalInstance,topController){
			this.message =msg;
			this.isSuccess =state;
			this.ok = () =>{
				$uibModalInstance.close('ok');
			};
		});
	};
}
	HairdresserbookingController.$inject =['Auth','API', '$log', 'ModalFactory','hairdresserMAnager','customerMAnager','$q'];
export {HairdresserbookingController};


