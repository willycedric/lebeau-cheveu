class SearchbarController {
  constructor($stateParams,API,$log,searchBar,Location,AuthToken,hairdresserMAnager) {
  	
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
      var searchParameters={
        location:selectedLocation[0]+selectedLocation[1],
        haircut:this.listOfavailableHaircuts.indexOf(selectedHaircut),
        category:this.listOfAvailableCategories.indexOf(this.selectedCategory)
      };
      this.findHairdressersAccordingToSelectedArea(searchParameters);
      
    };   

  }//end constructeur

  /**
   * [loadTheRightHaircutList description]
   * @return {[type]} [description]
   */
  loadTheRightHaircutList(){
  	this.$log.debug('available categories ',this.availableHaircutCategories);
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
        this.listOfSelectedHairdressers = data;
        this.$log.debug( this.listOfSelectedHairdressers);
        this.isAtLeastOneHairdresserFound=true;
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

}

SearchbarController.$inject= ['$stateParams','API','$log','searchBar','Location','AuthToken','hairdresserMAnager'];

export {SearchbarController};


