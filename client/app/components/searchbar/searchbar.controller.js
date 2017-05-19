class SearchbarController {
  constructor($stateParams,API,$log,searchBar,Location,AuthToken,hairdresserMAnager,$scope,$q,geolocation,NgMap,$window,$location,DateHandler) {
  	
     // Initializes Variables
    // ----------------------------------------------------------------------------
  	this.$stateParams = $stateParams;
  	this.API = API;
  	this.$log = $log;
    this.DateHandler=DateHandler;
  	this.searchBar = searchBar;
    this.hairdresserMAnager=hairdresserMAnager;
    this.AuthToken = AuthToken;
  	//Location field logic
  	this.Location = Location;
  	this.towns = Location.towns;
  	this.getLocation = Location.getLocation;
    this.listOfAvailableCategories = this.searchBar.getListOfavailableCategories();
  	this.asyncSelected = undefined;
  	this.selected = undefined;
    this.isAtLeastOneHairdresserFound =false; //use to trigger the display of the hairdressers found
    this.disPlayInitialForm =true;
    this.disPlayNoResult  = true;
    this.detailAlerts=[]
    this.$scope=$scope;
    this.$q = $q;
    this.geolocation =geolocation;
    //define calendar display mode.
    this.mode="week";
   this.NgMap = NgMap;
   this.formatted_address=this.$stateParams.selectedLocation;   
   this.$window =$window;
   this.$location =$location;
   this.defaultRating =3.6;
   this.events =[];//list of hairdresser appointments
    var vm = this;
    NgMap.getMap().then(function(map) {
      console.log(map.markers.user);//.style.background="blue";
     
      vm.showCustomMarker= function(evt) {
        map.customMarkers.foo.setVisible(true);
        map.customMarkers.foo.setPosition(this.getPosition());
      };
       //redirect to user to the selected hairdresser profile
      vm.goToHairdresserProfile= function(evt,hairdresserId) {          
          var url = "/showhairdresserprofile/"+hairdresserId.toString();
          if(hairdresserId!=undefined){
            vm.$location.path(url);
          }else{
            throw new Error(" the hairdresser id is not defined");
          }
      };
    });    

    //toggle animation of the customer marker
    vm.toggleBounce = function() {
      if (this.getAnimation() != null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

 


   //Writing the selected category and location to the local storage   
   console.log("location",this.$stateParams.selectedLocation);  
    this.saveOnLocalStorage('selectedLocation',this.$stateParams.selectedLocation);
    this.saveOnLocalStorage('selectedCategory', this.$stateParams.selectedCategory); 
    this.saveOnLocalStorage('longitude', this.$stateParams.longitude);
    this.saveOnLocalStorage('latitude',this.$stateParams.latitude);
    this.AuthToken.saveObj("components",this.$stateParams.address_components);    
   
    
  	//retrieving search parameters from the home page 
  	this.selectedLocation =AuthToken.get('selectedLocation');
  	this.selectedCategory = AuthToken.get('selectedCategory');
    this.longitude = this.AuthToken.get('longitude');
    this.latitude = this.AuthToken.get('latitude');
   // this.components = this.AuthToken.getObj('components');
  	//list of Available haircuts
  	this.listOfavailableHaircuts = null;
  	this.availableHaircutCategories =this.searchBar.getListOfavailableCategories();
        //this.$log.log("availableHaircutCategories ",this.availableHaircutCategories);
  	//Load the righ haircut list according to the parameters sent by the custome on the home search form
  	this.loadTheRightHaircutList();
   //this.getCurrentUserLocation();
 // this.launchSearch(this.selectedLocation,selectedHaircut,this.longitude,this.latitude);
  //=>{       
  //     this.AuthToken.save("locationParameter", selectedLocation);
  //     this.AuthToken.save('selectedHaircut',selectedHaircut);
  //     this.detailAlerts =[];  
  //     var checkOptions = ()=>{
  //       var defered = this.$q.defer();
  //        var reason=[];
  //        if(selectedHaircut==undefined || selectedHaircut==""){
  //           reason.push("haircut");
  //         } 
  //         if(selectedLocation ==undefined || selectedLocation==""){
  //           reason.push("location");
  //         }
  //         defered.resolve(reason);
  //         return defered.promise;
  //     };      
  //    checkOptions()
  //    .then((reason)=>{
  //      if(reason.length==0){
  //        if(this.$scope.formatted_address){
  //           this.initSearch(this.$scope.address_components,this.$scope.longitude,this.$scope.latitude,this.$scope.formatted_address)
  //           .then((data)=>{
  //            data.haircut=this.listOfavailableHaircuts.indexOf(selectedHaircut);
  //            data.category=this.listOfAvailableCategories.indexOf(this.selectedCategory);
  //            console.log("search parameter ",data);
  //             this.findHairdressersAccordingToSelectedArea(data);
  //           });
           
  //        }else{
  //          var searchParameters={
  //             location:selectedLocation,
  //             haircut:(this.listOfavailableHaircuts.indexOf(selectedHaircut)),
  //             category:this.listOfAvailableCategories.indexOf(this.selectedCategory),
  //             longitude:parseFloat(this.longitude),
  //             latitude:parseFloat(this.latitude)
  //           };
  //           console.log(searchParameters);            
  //           this.findHairdressersAccordingToSelectedArea(searchParameters);
  //        }          
  //       }else{
  //         angular.forEach(reason,(elt)=>{
  //           switch(elt){
  //             case "haircut":
  //               this.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une coiffure." });
  //               break;
  //               case "location":
  //                 this.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une location." });
  //               break;
  //               default:
  //                 this.detailAlerts.push({ type: 'danger', msg: "Une option de recherche est absente." });
  //               break;
  //           }
  //         });       
  //       }
  //    });
  // };   

   this.init()
  }//end constructeur

  /**
   * [loadTheRightHaircutList description]
   * @return {[type]} [description]
   */
  loadTheRightHaircutList(){  	
  	if(this.selectedCategory === this.availableHaircutCategories[0]){ //afro haircuts
  		this.listOfavailableHaircuts = this.searchBar.getListOfavailableAfroHaircuts();
  	}else if (this.selectedCategory === this.availableHaircutCategories[1]) { //european haircuts
  		this.listOfavailableHaircuts = this.searchBar.getListOfavailableEuropeanHaircuts();
  	}else if(this.selectedCategory === this.availableHaircutCategories[2]){ //curly hairs
  		this.listOfavailableHaircuts =  this.searchBar.getListOfavailableCurlyHaircuts();
  	}
  }

  /**
   * [indexOfSelectedHaircuts description]
   * @param  {[type]} listOfSelectedHaircuts [description]
   * @return {[type]}                        [description]
   */
  indexOfSelectedHaircuts(listOfSelectedHaircuts){
    var listOfIndex=[];
    angular.forEach(listOfSelectedHaircuts, (val)=>{
      if(this.listOfavailableHaircuts.indexOf(val)!=-1){
        listOfIndex.push(this.listOfavailableHaircuts.indexOf(val));
      }
    });
     return listOfIndex;
  };
  /**
   * [findHairdressersAccordingToSelectedArea description]
   * @param  {[type]} seachParameters [description]
   * @return {[type]}                 [description]
   */
  findHairdressersAccordingToSelectedArea(seachParameters){
    var self=this;
    var defered = this.$q.defer();
    this.hairdresserMAnager.findHairdressers(seachParameters)
    .then((data)=>{
        if(data.length>0){//display the search result if a least on hairdresser is found
          this.listOfSelectedHairdressers = data;

          //this.$window.location.reload();             
          this.isAtLeastOneHairdresserFound =true;
           this.disPlayNoResult=true;
           this.disPlayInitialForm=true;
           defered.resolve(data);
           return defered.promise;
        }else{ 
          this.isAtLeastOneHairdresserFound=false;
          this.disPlayNoResult=false;
          this.disPlayInitialForm=false;
          return "";
        }
    })
  .then((data)=>{
    console.log("data ", data);
    angular.forEach(data,(hairdresser,index)=>{    
       var tempArray =[];               
          angular.forEach(hairdresser.appointments, (appt,key)=>{
            //self.events.push({id:appt._id, date:appt.dayOfWeek, startTime:appt.slotTime, type:appt.slotType,state:appt.slotState,status: appt.slotState==0?'booked':(appt.slotState==-1?'pending':(appt.slotType===-1?'locked':'free')), relatedCustomer:appt.relatedCustomers,allDay:false});
            if(appt.slotType!=-1 && appt.hasOwnProperty('slotTime')){
                console.log("I am here");
                tempArray.push({
                id:appt._id, 
                startTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(parseInt(appt.slotTime.split('h')[0]),'hours').toDate() , 
                endTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(parseInt(appt.slotTime.split('h')[0])+4,'hours').toDate(),
                type:appt.slotType,
                state:appt.slotState,
                status: appt.slotState==0?'booked':(appt.slotState==-1?'pending':(appt.slotType===-1?'locked':'free')),
                relatedCustomer:appt.relatedCustomers,
                allDay:false,
                title:"Occupé"
              });
            }              
            else if(appt.slotType==-1){
               tempArray.push({
                id:appt._id, 
                startTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(1, 'hours').toDate(), 
                endTime:self.DateHandler.moment(appt.dayOfWeek.split('T')[0]).add(24,'hours').toDate(),               
                type:appt.slotType,
                state:appt.slotState,
                status: 'locked',                
                allDay:false,
                title:"Occupé"
              });
            }else{
              throw new Error(" no slot time available");
            }              
           
        }); //end inner loop
         //self.events[index].push() = new Array();
            self.events.push(tempArray);
            console.log("tempArray",tempArray,"list of appointments",self.events[0]);                        
    });//end external loop
   
  });
  };
/**
 * [saveOnLocalStorage Save a key,value pair to the local storage]
 * @param  {[type]} key [description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
 saveOnLocalStorage( key,val){
  if(this.AuthToken.get(key) == val){ //property already saved do nothing

  }else if(val == null){ //if the value is null do nothing
  }else{
    this.AuthToken.save(key,val);
  }
};

 closeAlert(alert, ind){
      alert.splice(ind, 1);
    };
  closeDetailAlert(ind){
      this.closeAlert(this.detailAlerts, ind);
    };

 initSearch(components,longitude,latitude,formatted_address){
				var defered = this.$q.defer();
				var data ={};
				if(this.$scope){			
				for (var i in components)
				{				
					var component =components[i];
					for (var j in component.types) {  // Some types are ["country", "political"]
						switch(component.types[0]){
							case"postal_code":
							data.postal_code = component.long_name;
							break;
							case "administrative_area_level_1":
							data.administrative_level_1 = component.long_name;
							break;
							case "administrative_area_level_2":
								data.administrative_level_2 = component.long_name;
							break;
							case "locality":
								data.locality = component.long_name;
							break;
							case "country":
								data.country = component.long_name;
							break;
							default:
							break;
						}			
					}
					
				}
				data.longitude = longitude;
				data.latitude = latitude;
				data.formatted_address = formatted_address;		
        this.formatted_address = formatted_address;		
				defered.resolve(data);
			}else{
				//throw new Error("the scope variable is not available");
				defered.reject(new Error("the scope variable is not available"));
			}
			return defered.promise;
		}
    /**
     * Redirect the customer to the hairdresser profile. 
     */

    takeAnAppointment(hairdresserId){
          var self = this;
          var url = "/showhairdresserprofile/"+hairdresserId.toString();
          if(hairdresserId!=undefined){
            self.$location.path(url);
          }else{
            throw new Error(" the hairdresser id is not defined");
          }
    }

    launchSearch(selectedLocation,selectedHaircut,longitude,latitude){ 
        var self = this;      
      self.AuthToken.save("locationParameter", selectedLocation);
      self.AuthToken.save('selectedHaircut',selectedHaircut);
      self.AuthToken.save('longitude',self.$scope.longitude);
      self.AuthToken.save('latitude',self.$scope.latitude );
      self.detailAlerts =[];  
      var checkOptions = ()=>{
        var defered = this.$q.defer();
         var reason=[];
         if(selectedHaircut==undefined || selectedHaircut==""){
            reason.push("haircut");
          } 
          if(selectedLocation ==undefined || selectedLocation==""){
            reason.push("location");
          }
          defered.resolve(reason);
          return defered.promise;
      };      
     checkOptions()
     .then((reason)=>{
       if(reason.length==0){
         if(this.$scope.formatted_address){
           if(longitude==undefined || latitude == undefined){
              self.initSearch(self.$scope.address_components,self.$scope.longitude,self.$scope.latitude,self.$scope.formatted_address)
              .then((data)=>{
              data.haircut=self.listOfavailableHaircuts.indexOf(selectedHaircut);
              data.category=self.listOfAvailableCategories.indexOf(self.selectedCategory);
              
                self.findHairdressersAccordingToSelectedArea(data);
              });
           }else{
             self.initSearch(self.$scope.address_components,longitude,latitude,self.$scope.formatted_address)
              .then((data)=>{
              data.haircut=self.listOfavailableHaircuts.indexOf(selectedHaircut);
              data.category=self.listOfAvailableCategories.indexOf(self.selectedCategory);
             
                self.findHairdressersAccordingToSelectedArea(data);
              });
           }        
         }else{
           var searchParameters={
              location:selectedLocation,
              haircut:(self.listOfavailableHaircuts.indexOf(selectedHaircut)),
              category:self.listOfAvailableCategories.indexOf(self.selectedCategory),
              longitude:parseFloat(self.longitude),
              latitude:parseFloat(self.latitude)
            };
           
            self.findHairdressersAccordingToSelectedArea(searchParameters);
         }          
        }else{
          angular.forEach(reason,(elt)=>{
            switch(elt){
              case "haircut":
                self.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une coiffure." });
                break;
                case "location":
                  self.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une location." });
                break;
                default:
                  self.detailAlerts.push({ type: 'danger', msg: "Une option de recherche est absente." });
                break;
            }
          });       
        }
     });
  }; 

  init(){
      var self = this;      
      var locationParameter = self.AuthToken.get('locationParameter');
      var selectedHaircut = self.AuthToken.get('selectedHaircut');
      var longitude = self.AuthToken.get('longitude');
      var latitude = self.AuthToken.get('latitude');
      if(selectedHaircut != undefined && locationParameter !=undefined){
          self.launchSearch(locationParameter,selectedHaircut,longitude,latitude);
      }
    }  
   
}
SearchbarController.$inject= ['$stateParams','API','$log','searchBar','Location','AuthToken','hairdresserMAnager','$scope','$q','geolocation','NgMap','$window','$location','DateHandler'];

export {SearchbarController};


