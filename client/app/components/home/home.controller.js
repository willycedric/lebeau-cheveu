import labels from '../../../../labels.json';
import images from '../../../../images.json';


class HomeController {
  constructor(Location, $location, $state,$stateParams,AuthToken,$rootScope,$log,Auth,searchBar,Map,$scope, publicFactory) {
  	this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1475226327/banner10_fdlxry.jpg";
  	this.nbImages = 3;//images.length;
	this.homeGallery = [];
  		//labels
	 this.labels=labels;
	 //list of available haircuts categories obtained from the searchBar factory
	 this.listOfAvailableCategories = searchBar.getListOfavailableCategories();
	//customer selected category and location
	this.selectedHaircutCategory = null;
	this.selectedLocation = null;
	this.publicFactory = publicFactory;
	 this.$state = $state;
	 this.$log =$log;
	 this.$scope=$scope;
	 this.$location=$location;
         this.selected =true;
         //Properties used to generate the map
	 this.Map = Map;
         //css properties
        this.mapstroke=this.Map.cssProperties.mapstroke;
        this.mapstroke_width=this.Map.cssProperties.mapstroke_width;
        this.mapWidth=this.Map.cssProperties.mapWidth;
        this.mapHeight=this.Map.cssProperties.mapHeight;
         //Map svg details
        this.zonePaths = Map.paths;
        //Object used to construct the map
        this.obj = [];

        //Bundle all the map properties in a unique array 
        for(var zone in Map.zonePaths){
                this.obj.push(Map.zonePaths[zone]);
        }

        this.displayRegionName = (name)=>{
                this.name = name;
        };
	 //List of availables towns
	 this.towns = Location.towns;
	 this.getLocation = Location.getLocation;
	 this.asyncSelected=undefined;
	 //selected town
	 this.selected=undefined;
	 //Carousel logic
	  this.myInterval = 7000;
	  this.noWrapSlides = false;
	  this.active = 0;
          const avalaibleHairdresserDepartements =[67300,59000,82000,72100,26000,33800,33800,33800,33270,92380,83200,69100,38100,93000,31770,16000,59000,69100,95310,91350,91100,74100,92370,51100,37000,45000,51100,91280,75020,95700,44100,75012,40465,42390,62000,
              69009,81300,37300,28000,37300,37000,37320,37000,37000,45100,35000,35000,35001,35001,35001];
          
           this.truncateTo2CharactersHairdresserDepartementList = this.truncateTo2(avalaibleHairdresserDepartements);
	  const slides = this.slides = [];
	  let currIndex = 0;
	  this.text=['Un style toujours dans l\'air du temps à des coûts défiants toutes concurrences ...'
	  			 ,'Pas besoin de vous déplacer ni de prévoir du temps  pour vos coiffures ...'
	      		 ,'Lebeaucheveu est le choix gagnant de nombreuses femmes ...'
	      		 ,'Nos coiffeuses vous donneront toujours le meilleur d\'elles mêmes ...'
	      		 ];

	  this.addSlide = function(i) {
	  	const newWidth = 1280 + slides.length + 1;
	    slides.push({
	      image:images[i].url,
	      text: this.text[i],
	      id: currIndex++
	    }); 
	  };

	  for (let i = 0; i < this.nbImages; i++) {
	    this.addSlide(i);
	  }

	  this.onSlideChanged = function (nextSlide, direction, nextIndex) {
		    //console.log("slide changed: ",nextIndex);
	  };


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
			self.publicFactory.GetHomeGalleryEntries()
			.then( function fetchedHomeGalleryEntriesSuccess(res){				
				self.homeGallery = res.data;
			},function fetchedHomeGalleryEntriesError (err){
				console.error(err.toString());
			});
		 }

		//redirect to hairdresser public profile
		 goToHairdresserProfile(id){
			 this.$location.path('showhairdresserprofile/'+id.toString());
		 }

};

HomeController.$inject=['Location','$location', '$state','$stateParams','AuthToken','$rootScope','$log','Auth','searchBar','Map','$scope', 'publicFactory'];
export {HomeController};


