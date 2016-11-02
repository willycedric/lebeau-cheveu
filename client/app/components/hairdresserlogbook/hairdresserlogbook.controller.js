	import _ from 'lodash';
  class HairdresserlogbookController {
	  constructor(AuthToken,Auth,API,$log,$state,$uibModal,hairdresserMAnager,$scope) {
	  	// hairdressers account informations
	  	var self = this;
	  	self.hairdresser={};
	  	self.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
	  	self.days = [];
      self.times =[];
      self.log = $log;
      self.contentLoaded=true;
      const availableAppointmentDays=31; //Use to limit the datepicker to one month in order to prevent user to go to far in the future
	    self.dt = new Date();
		//If a user is connected through the localStretegy, retrieveed the token from the localStorage
	 	var token = AuthToken.getToken();
	    if(token){
	        this.username= AuthToken.parseToken(token).name;
	    }
      //self.log.debug('hairdresser',self.hairdresser);
      var events=[];
      var listOfAvailableAppointments=[];
      Auth.getProfile(`${API.dev.hairdresserRoute}`+'/me')
      .then((rep)=>{
          self.hairdresser = rep;
          //datepicker logic
         angular.forEach(self.hairdresser.appointments, (appt,key)=>{
           events.push({date:appt.dayOfWeek,status: appt.slotType[key]=='1'?'full':'partially'})
        });

         //building list of available appointments
        angular.forEach(self.hairdresser.appointments, (appt)=>{
            listOfAvailableAppointments.push(appt.dayOfWeek);
        })
      });
    
      self.options = {
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

      var today = new Date();
      self.log.debug(events);
      $scope.$watch('vm.dt', function(value){      
        self.log.debug(value);
      });
      /**
       * [description]
       * @return {[type]} [description]
       */
      self.updateMyLogbook = ()=>{
                  var self = this;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'logbook.html',
                  controller:function($uibModalInstance, hairdresser){
                      this.ok = ()=>{                      
                        $uibModalInstance.dismiss('close');
                        $log.debug('clicked on the ok button');
                      };
                      this.cancel = ()=>{
                        $log.debug('clicked on the cancel button');
                        $uibModalInstance.close('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  resolve:{
                    hairdresser: function(){
                      return self.hairdresser;
                    }
                  },
                  size:'sm'
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
        };
	};//end constructor;

}
HairdresserlogbookController.$inject =['AuthToken','Auth','API','$log','$state','$uibModal','hairdresserMAnager','$scope'];

export {HairdresserlogbookController};


