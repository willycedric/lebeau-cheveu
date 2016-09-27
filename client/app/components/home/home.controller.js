import labels from '../../../../labels.json';
import images from '../../../../images.json';


class HomeController {
  constructor(Map,$stateParams,AuthToken,$rootScope,Auth) {
  	this.url ="http://res.cloudinary.com/hgtagghpz/image/upload/v1469680583/ad9thuvcppgddha4myrp.jpg";
  	this.nbImages = 3;//images.length;
  		//labels
	 this.labels=labels;
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
	      image: "http://placekitten.com/1900/600",//images[i].url,
	      text: this.text[i],
	      id: currIndex++
	    }); 
	  };

	  for (let i = 0; i < this.nbImages; i++) {
	    this.addSlide(i);
	  }

	  //Map part of the controller
	  //css properties
			this.mapstroke=Map.cssProperties.mapstroke;
			this.mapstroke_width=Map.cssProperties.mapstroke_width;
			this.mapWidth=Map.cssProperties.mapWidth;
			this.mapHeight=Map.cssProperties.mapHeight;

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
			}

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
}

HomeController.$inject=['Map','$stateParams','AuthToken','$rootScope','Auth'];
export {HomeController};


