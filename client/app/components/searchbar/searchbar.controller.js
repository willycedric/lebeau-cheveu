class SearchbarController {
  constructor($stateParams,API,$log,searchBar,Location,AuthToken,hairdresserMAnager,$scope,$q) {
  	
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

   //Writing the selected category and location to the local storage   
    this.saveOnLocalStorage('selectedLocation',this.$stateParams.selectedLocation);
    this.saveOnLocalStorage('selectedCategory', this.$stateParams.selectedCategory);  
    
    
    
  	//retrieving search parameters from the home page 
  	this.selectedLocation =AuthToken.get('selectedLocation');
  	this.selectedCategory = AuthToken.get('selectedCategory');
  	//list of Available haircuts
  	this.listOfavailableHaircuts = null;
  	this.availableHaircutCategories =this.searchBar.getListOfavailableCategories();
        this.$log.log("availableHaircutCategories ",this.availableHaircutCategories);
  	//Load the righ haircut list according to the parameters sent by the custome on the home search form
  	this.loadTheRightHaircutList();

    this.launchSearch = (selectedLocation,selectedHaircut)=>{
      console.log("selectedLocation",selectedLocation);
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
            var searchParameters={
              location:(selectedLocation.toUpperCase()==this.$scope.formatted_address.split(' ')[0].toUpperCase())?this.$scope.formatted_address.split(' ')[0]:selectedLocation[0]+selectedLocation[1],
              haircut:(this.listOfavailableHaircuts.indexOf(selectedHaircut)-1),
              category:this.listOfAvailableCategories.indexOf(this.selectedCategory)
              };
            this.findHairdressersAccordingToSelectedArea(searchParameters);
         }else{
           var searchParameters={
              location:selectedLocation[0]+selectedLocation[1],
              haircut:(this.listOfavailableHaircuts.indexOf(selectedHaircut)),
              category:this.listOfAvailableCategories.indexOf(this.selectedCategory)
              };
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

}

SearchbarController.$inject= ['$stateParams','API','$log','searchBar','Location','AuthToken','hairdresserMAnager','$scope','$q'];

export {SearchbarController};


