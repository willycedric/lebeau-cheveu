import labels from '../../../../labels.json';
import images from '../../../../images.json';


class HomeController {
  constructor(Location,$state,$stateParams,AuthToken,$rootScope,$log,Auth,searchBar) {
  	this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1475226327/banner10_fdlxry.jpg";
  	this.nbImages = 3;//images.length;
  		//labels
	 this.labels=labels;
	 //list of available haircuts categories obtained from the searchBar factory
	 this.listOfAvailableCategories = searchBar.getListOfavailableCategories();
	//customer selected category and location
	this.selectedHaircutCategory = null;
	this.selectedLocation = null;

	 this.$state = $state;
	 this.$log =$log;
         this.selected =true;
	 

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

	}; //End constructor 

	/**
	 * [goToSearchBarView go to the searchbar component with the selected category and location]
	 * @return {[]} []
	 */
	goToSearchBarView(){		
		if(this.selectedHaircutCategory !== null || this.selectedLocation !==null){
                    console.log('selectedHaircutCategory ',this.selectedHaircutCategory, 'selectedLocation ',this.selectedLocation);
			this.$state.go('searchbar', {selectedCategory:this.selectedHaircutCategory,selectedLocation:this.selectedLocation});
		}else{
			//must find a way to display an error message
			this.$log.info('the form is empty');
		}
		
	}
};

HomeController.$inject=['Location','$state','$stateParams','AuthToken','$rootScope','$log','Auth','searchBar'];
export {HomeController};


