class SearchbarController {
  constructor($stateParams,API,$log,searchBar,Location,AuthToken,hairdresserMAnager,$scope,$q,geolocation,NgMap,$window) {
  	
     // Initializes Variables
    // ----------------------------------------------------------------------------
  	this.$stateParams = $stateParams;
  	this.API = API;
  	this.$log = $log;
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
   this.NgMap = NgMap;
   this.formatted_address=this.$stateParams.selectedLocation;   
   this.$window =$window;
   //this.listOfSelectedHairdressers=[{location:"92500 Rueil-Malmaison, France",
    //                                profile_picture:"https://res.cloudinary.com/lebeaucheveu/image/upload/v1492826828/qw3xzqz96cq14g6hfefo.png",
     //                               _id:"58fab91b0af2bad1bce0274c"
    //                              }];
        var vm = this;
        NgMap.getMap().then(function(map) {
          vm.showCustomMarker= function(evt) {
            map.customMarkers.foo.setVisible(true);
            map.customMarkers.foo.setPosition(this.getPosition());
          };
          vm.closeCustomMarker= function(evt) {
            this.style.display = 'none';
          };
        });

        this.positions =[
          {pos:"17 rue michelet 92500 Rueil Malmaison, France"},
          {pos:"38 Rue aimé Fluttaz Courtry, France"}
        ];

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
    this.launchSearch = (selectedLocation,selectedHaircut)=>{      
      this.detailAlerts =[];  
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
            this.initSearch(this.$scope.address_components,this.$scope.longitude,this.$scope.latitude,this.$scope.formatted_address)
            .then((data)=>{
             data.haircut=this.listOfavailableHaircuts.indexOf(selectedHaircut);
             data.category=this.listOfAvailableCategories.indexOf(this.selectedCategory);
             console.log("search parameter ",data);
              this.findHairdressersAccordingToSelectedArea(data);
            });
           
         }else{
           var searchParameters={
              location:selectedLocation,
              haircut:(this.listOfavailableHaircuts.indexOf(selectedHaircut)),
              category:this.listOfAvailableCategories.indexOf(this.selectedCategory),
              longitude:parseFloat(this.longitude),
              latitude:parseFloat(this.latitude)
            };
            console.log(searchParameters);            
            this.findHairdressersAccordingToSelectedArea(searchParameters);
         }          
        }else{
          angular.forEach(reason,(elt)=>{
            switch(elt){
              case "haircut":
                this.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une coiffure." });
                break;
                case "location":
                  this.detailAlerts.push({ type: 'danger', msg: "Veuillez sélectionner une location." });
                break;
                default:
                  this.detailAlerts.push({ type: 'danger', msg: "Une option de recherche est absente." });
                break;
            }
          });       
        }
     });
  };   
  this.NgMapDetails();
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
    this.hairdresserMAnager.findHairdressers(seachParameters)
    .then((data)=>{
        if(data.length>0){//display the search result if a least on hairdresser is found
          this.listOfSelectedHairdressers = data;  
          //this.$window.location.reload();   
          console.log("received data", data);
          this.isAtLeastOneHairdresserFound =true;
           this.disPlayNoResult=true;
           this.disPlayInitialForm=true;
        }else{ 
          this.isAtLeastOneHairdresserFound=false;
          this.disPlayNoResult=false;
          this.disPlayInitialForm=false;
        }
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
     * 
     */
    NgMapDetails(){
     this.NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });
    }
}
SearchbarController.$inject= ['$stateParams','API','$log','searchBar','Location','AuthToken','hairdresserMAnager','$scope','$q','geolocation','NgMap','$window'];

export {SearchbarController};


