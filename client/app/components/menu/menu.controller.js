class MenuController {
  constructor($q,$log,hairdresserMAnager,hairdresserResource) {

	  	var deserialize = (data)=>{
	  		this.hairdresser = data.hairdresser;
	  		this.messages = data.hairdresser.notifications.length;
	  		this.agendaEnrties = hairdresserMAnager.getHairdresserNotYetConfirmedAppointmentNumber(this.hairdresser.appointments);
	  		
	  	};
	  	
	  var init = ()=>{	  	
	  	hairdresserResource.getSettings()
	   .then((rep)=>{	   		
	   		deserialize(rep);
	   })
	   .finally(()=>{
	   		this.count=0;
		    angular.forEach(this.hairdresser.nextbookings, (apt)=>{
		      if(apt.appointmentState === -1){
		        this.count++;
		      }
		    });
	   });
	 }; 
    

	  init();
	}//end constructor

}
MenuController.$inject=['$q','$log','hairdresserMAnager','hairdresserResource']
export {MenuController};


