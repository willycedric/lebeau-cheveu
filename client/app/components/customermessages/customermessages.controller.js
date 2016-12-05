class CustomermessagesController {
	  constructor(Auth,API,ModalFactory,customerMAnager,$window,$log) {
	 
	  	this.Auth = Auth;
	  	this.API =API;
	  	this.ModalFactory=ModalFactory;
	  	this.customerMAnager = customerMAnager;
	  	this.$log= $log;
	  	this.$window = $window;
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
      
		Auth.getProfile(`${API.dev.customerRoute}`+'/me')
	      .then((rep)=>{
	          this.customer = rep;
        });
	};//end constructor;
	showCustomerNotification(message){
		var self=this;
		this.ModalFactory.trigger(self,'customer-notification.html', function($uibModalInstance,topController){
			this.message=message;
			this.ok = ()=>{
				//set the flag read to true.
				topController.customerMAnager.updateCustomerNotificationState(message)
				.then((rep)=>{
					topController.$log.info('boolean successfully updated');
				});
				//reload the window in order to update the view
				topController.$window.location.reload();
				$uibModalInstance.close('read');
			}
		})
	}
	/**
	 * [getUnreadNotification return the number of unread notification]
	 * @param  {[type]} customer [description]
	 * @return {[type]}          [description]
	 */
	getUnreadCustomerNotification(notifications){
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
}

CustomermessagesController.$inject =['Auth','API','ModalFactory','customerMAnager','$window','$log'];
export {CustomermessagesController};


