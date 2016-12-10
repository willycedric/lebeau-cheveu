
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
                //console.log("slide changed: ",nextIndex);
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
        /**
         * Function used to display the login modal when the customer is not logged in
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
           this.displayLoginModal = ()=>{
                  var modalInstance = $uibModal.open({
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
        this.displayModalAskingToLoggedin = ()=>{
            ModalFactory.trigger(this,'confirmation.html',function($uibModalInstance,topController){
                      this.ok = ()=>{
                        topController.displayLoginModal();
                        $uibModalInstance.close('cancel');
                        //$log.debug('clicked on the ok button');
                      };
                      this.cancel = ()=>{
                        //$log.debug('clicked on the cancel button');
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
        };
        /**
         * Confirmation Modal
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayConfirmationModal = (customerId,username,lastname,firstname)=>{
                  ModalFactory.trigger(this,'slot-confirmation.html',function($uibModalInstance,topController){
                    //const list =topController.API.dev.openingHourList; //["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
                    this.dt = topController.dt;
                     //this.openingHourList =list;
                    topController.getAvailableSloteTimeForTheSelectedDay(this.dt)
                    .then((resp)=>{  
                        console.log(resp);                       
                         this.openingHourList=topController.displayNoAvailableSlotModal(this.dt,resp);                         
                      });
                  //topController.getAvailableSloteTimeForTheSelectedDay(this.dt);

                    
                   
                    this.showError=false;
                      this.ok = (index)=>{
                        if( index == undefined){
                          this.showError =true;
                        }else{
                              //topController.updateHairdresserAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index],customerId,username,lastname,firstname);
                              //topController.updateCustomerAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index], topController.hairdresser.username);
                              topController.updateHairdresserThenCustomerAppointment(topController.hairdresser._id,this.dt,this.openingHourList[index],customerId,username,lastname,firstname, topController.hairdresser.username);
                            //$window.location.reload();
                           $uibModalInstance.close('cancel');
                        }                      
                      };
                      this.cancel = ()=>{
                        $uibModalInstance.dismiss('cancel');
                      };
                  });
        };
        /**
         * [dateInThePastModal Modal displayed when a user slect a date in the pass]
         * @type {[type]}
         */
        this.dateInThePastModal = () =>{
          ModalFactory.trigger(this,'date-in-the-pass.html',function($uibModalInstance,topController){
            this.ok = ()=>{
              $uibModalInstance.close('close');
            };
          });
        };
        /**
         * [description]
         * @param  {[type]} dayOfWeek     [description]
         * @param  {[type]} index         [description]
         * @param  {[type]} appointmentId [description]
         * @param  {[type]} size          [description]
         * @return {[type]}               [description]
         */
        this.displayAlreadyReserved = (dayOfWeek,index,appointmentId,size)=>{
                  var self = this;
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'slot-reservation.html',
                  controller:function($uibModalInstance){
                    this.selectedTimeSlot = dayOfWeek;
                    this.slotHour = self.openingHourList[index]; 
                      this.ok = ()=>{
                        $uibModalInstance.close('cancel');
                        
                      };

                      this.cancel = ()=>{
                        $uibModalInstance.dismiss('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size,
                  resolve: {
                    times: function () {
                      return  self.selectedTimeSlot;
                    }
                  }
                });

               modalInstance.result.then(function (selectedItem) {
                 // $ctrl.selected = selectedItem;
                }, function () {
                  //$log.info('Modal dismissed at: ' + new Date());
                });
        };

        /**
         * [display a message wich inform that the logbook is only accessible to customer not hairdresser]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        this.displayOnlyForCustomerModal = (size)=>{
                  var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'only-customer.html',
                  controller:function($uibModalInstance){
                      this.ok = ()=>{
                        $uibModalInstance.close('cancel');
                        
                      };

                      this.cancel = ()=>{
                        $uibModalInstance.dismiss('cancel');
                      };
                  },
                  controllerAs: '$ctrl',
                  size: size
                });
               modalInstance.result.then(function () {
                 
                }, function (){
                 
                });
        };

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
      this.updateHairdresserThenCustomerAppointment=(hairdresserId, dayOfWeek,selectedHour,customerId,username,lastname,firstname, hairdresserUsername)=>{
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
      this.displayAppointmentConfirmationModal = (status, selectedDay,selectedHour)=>{
        ModalFactory.trigger(this,'appointment-registration-confirmation.html', function($uibModalInstance, topController){
           this.isSuccess= status;
           this.selectedDay = selectedDay;
           this.selectedHour = selectedHour;
          this.ok = () =>{
              $uibModalInstance.close('close')
              topController.$window.location.reload();
          };
        });
      };     
}//end constructor
  
  /**
   * [getListOfAvailableHours return the list of not already booked hours for a days]
   * @return {[type]} [description]
   */
  /*getListOfAvailableHours(){
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
            listOfAvailableHours.push({dayOfweek:new Date(appointment.dayOfWeek),slotTime:appointment.slotTime});
          });
          defered.resolve(listOfAvailableHours)
          return defered.promise;
        })
        .then((resp)=>{
          //return the list of already booked hours for a days
          var defered = self.$q.defer();
          defered.resolve(this.getListOfAppointmentHoursByDay(resp));
          return defered.promise;
        })
        .then((resp)=>{
          var tempHourList=[];
          var temp=[];
           console.log("response => ", resp);
          
          angular.forEach(resp, (elt,index)=>{
            console.log(elt);
            debugger;
           tempHourList=this.API.dev.openingHourList;
              angular.forEach(elt.hours, (hour)=>{
                angular.forEach(tempHourList,(value,index)=>{
                    if( value === hour){
                      //debugger;
                      tempHourList.splice(index,1);
                    }
                });//end third inner loop
              });//end second inner loop
              elt.hours = tempHourList;
          });// end top loop
          result.resolve(resp);     
        });
        return result.promise; 
  }*/
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
    * [isContained description]
    * @param  {[type]}  obj [description]
    * @param  {[type]}  day [description]
    * @return {Boolean}     [description]
    */
   isContained (obj,day){
    var temp=[];
    if(obj.length === 0){
      return -1
    }else{
      for(var i = 0; i< obj.length;i++){
          temp.push(obj[i].dayOfWeek);
      }
      return temp.indexOf(day);      
    }
  }
  /**
   * [removeDouble description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  getListOfAppointmentHoursByDay(obj){
    var self=this;
    var rep =[];
    var rep2=[];
    var index;
    var count;
    angular.forEach(obj,(elt,i)=>{
      count =0;
      for(var j=0; j< obj.length;j++){
        if(i === j){
          
        }else{
          if(elt.dayOfWeek.diff(obj[j].dayOfWeek,'days')===0){
            count++;
            index = self.isContained(rep,obj[j].dayOfWeek.date());
            if(index!=-1){
              if(rep[index].hours.indexOf(elt.hour) ==-1){
                rep[index].hours.push(elt.hour);
              }
            }else{
            rep.push({dayOfWeek:elt.dayOfWeek,hours:[elt.hour]});
          }
        }
      }
    }
    rep2[i]=count;
    }); 
    //adding elements wich are not doubled
    angular.forEach(rep2,(val,index)=>{
      if(val===0)
      rep.push(obj[index])
    });    
    return rep;
  }

  /**
   * [displayNoAvailableSlotModal return a list of available slot for the selected day or display a modal if no slot available]
   * @param  {[type]} index             [description]
   * @param  {[type]} availableSlotList [description]
   * @param  {[type]} openingHourList   [description]
   * @return {[type]}                   [description]
   */
  displayNoAvailableSlotModal(date,availableSlotList){
      if(availableSlotList.length>0){
        console.log('je suis ici');
        return availableSlotList;      
      }else{
        this.noAvailableSlotModal(date);
      }
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

  

}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log','$uibModal','hairdresserMAnager','customerMAnager','ModalFactory','$q','DateHandler'];
export {ShowhairdresserprofileController};


