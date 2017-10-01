import labels from '../../../../labels.json';
import images from '../../../../images.json';


class HomeController {
  constructor(Location, $location, $state,$stateParams,AuthToken,$rootScope,$log,Auth,searchBar,$scope, publicFactory) {
  	this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1475226327/banner10_fdlxry.jpg";
  	this.nbImages = 3;//images.length;
	this.homeGallery = [];
  		//labels
	 this.labels=labels;
	 //list of available haircuts categories obtained from the searchBar factory
	 this.listOfAvailableCategories = [];
	//customer selected category and location
	this.selectedHaircutCategory = null;
	this.selectedLocation = null;
	this.publicFactory = publicFactory;
	 this.$state = $state;
	 this.$log =$log;
	 this.$scope=$scope;
	 this.$location=$location;
    this.selected =true;
        


	   //If a user is connected throught oauth, the token is retrieved from the url
	    //a save in the localStorage 
		if($stateParams.token){   	  	
			AuthToken.saveToken($stateParams.token);//Saved the token in the localStorage
			var data={
				user:{					
					    userName:AuthToken.parseToken($stateParams.token).name,
					    role:AuthToken.parseToken($stateParams.token).role							
				}
			};
			$rootScope.$broadcast('connectionStatechanged',{data:data.user});
	    }
	
		//load the public gallery entries
		this.init();
	}; //End constructor 

	/**
	 * [goToSearchBarView go to the searchbar component with the selected category and location]
	 * @return {[]} []
	 */
	goToSearchBarView(searchForm){
		console.log('inside this fucntion',searchForm );
		if(searchForm.$valid){
			if(this.selectedLocation!=undefined){
				if(this.$scope.data.formatted_address!=undefined){					
						this.$state.go('searchbar', {selectedCategory:this.selectedHaircutCategory,selectedLocation:this.$scope.data.formatted_address,longitude:this.$scope.data.longitude,latitude:this.$scope.data.latitude,address_components:this.$scope.data.address_components,homePage:true});					
				}else{					
					this.$state.go('searchbar', {selectedCategory:this.selectedHaircutCategory,selectedLocation:this.selectedLocation,homePage:true});//the boolean homePage allows the system to know that request is initiated from the homePage
				}
		}else{
			throw new Error("no selected location was specified.");
		}
	}
}
        
        /**
         * 
         * @param {Array} liste
         * @returns {Array|HomeController.truncateTo2.truncateList}
         */
         truncateTo2 (liste){
            var truncateList=[];
            liste.forEach(function(elt){
              truncateList.push(elt.toString()[0]+elt.toString()[1]);
            });
           return truncateList;
          }
          
          /**
           * 
           * @param {string} index, departement two characters index
           * @param {Array} list , list of trunctated hairdressers departements
           * @param {string} defaultColor, svg path default color
           * @param {string} customColor, svg path custom color 
           * @returns {stirng} selected color
           */
         svgPathFiller(index,list, defaultColor, customColor){        
            
            return (list.indexOf(index)=== -1)?defaultColor:customColor;
         }
         /**
          * [goToJoinState description]
          * @return {[type]} [description]
          */
         goToJoinState(){
         	this.$state.go("join");
         }

		 init (){
			var self=this;
			//Fetch hairdresser categories entry
			self.publicFactory.GetHomeGalleryEntries()
			.then( function fetchedHomeGalleryEntriesSuccess(res){				
				self.homeGallery = res.data;
			},function fetchedHomeGalleryEntriesError (err){
				console.error(err.toString());
			});

			//Fetch available haircut categories
			self.publicFactory.GetListOfAvailableHaircutCatalogs()
			.then(function haircutCatalogsSuccess(res){
				self.listOfAvailableCategories = res.data.record;
			}, function haircutCatalogsError (err){
				console.error(err.toString());
			});
		 }

		//redirect to hairdresser public profile
		 goToHairdresserProfile(id){
			 this.$location.path('showhairdresserprofile/'+id.toString());
		 }

};

HomeController.$inject=['Location','$location', '$state','$stateParams','AuthToken','$rootScope','$log','Auth','searchBar','$scope', 'publicFactory'];
export {HomeController};


