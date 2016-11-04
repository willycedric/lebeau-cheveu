class SearchbarController {
  constructor($stateParams,API,$log,searchBar,Location) {
  	
  	this.$stateParams = $stateParams;
  	this.API = API;
  	this.$log = $log;
  	this.searchBar = searchBar;
  	//Location field logic
  	this.Location = Location;
  	this.towns = Location.towns;
  	this.getLocation = Location.getLocation;
  	this.asyncSelected = undefined;
  	this.selected = undefined;

  	//retrieving search parameters from the home page 
  	this.selectedLocation = this.$stateParams.selectedLocation;
  	this.selectedCategory = this.$stateParams.selectedCategory;
  	//list of Available haircuts
  	this.listOfavailableHaircuts = null;
  	this.availableHaircutCategories =this.searchBar.getListOfavailableCategories();
  	//Load the righ haircut list according to the parameters sent by the custome on the home search form
  	this.loadTheRightHaircutList();

	

  }//end constructeur

  loadTheRightHaircutList(){
  	this.$log.debug('available categories ',this.availableHaircutCategories)
  	if(this.selectedCategory === this.availableHaircutCategories[0]){ //afro haircuts
  		this.listOfavailableHaircuts = this.searchBar.getListOfavailableAfroHaircuts();
  	}else if (this.selectedCategory === this.availableHaircutCategories[1]) { //european haircuts
  		this.listOfavailableHaircuts = this.searchBar.getListOfavailableEuropeanHaircuts();
  	}else if(this.selectedCategory === this.availableHaircutCategories[2]){ //curly hairs
  		this.listOfavailableHaircuts =  this.searchBar.getListOfavailableCurlyHaircuts();
  	}
  }


}

SearchbarController.$inject= ['$stateParams','API','$log','searchBar','Location'];

export {SearchbarController};


