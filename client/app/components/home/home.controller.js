import labels from '../../../../labels.json';
import images from '../../../../images.json';


class HomeController {
  constructor(Map) {

  		//labels
  		this.labels=labels;
		//Carousel logic
	  this.myInterval = 5000;
	  this.noWrapSlides = false;
	  this.active = 0;
	  const slides = this.slides = [];
	  let currIndex = 0;
	  this.text=['Un style toujours dans l\'air du temps à des coûts défiants toutes concurrences ...'
	  			 ,'Pas besoin de vous déplacer ni de prévoir du temps  pours vos coiffures ...'
	      		 ,'Lebeaucheveu est le choix gagnant de nombreuses femmes ...'
	      		 ,'Nos coiffeuses vous donneront toujours le meilleur d\'elles mêmes ...'
	      		 ,'Profiter de la tranquilité et du confort en vous faisant coiffer chez vous et à moindre coût ..'
	      		 ];

	  this.addSlide = function(i) {
	    slides.push({
	      image: images[i].url,
	      text: this.text[i],
	      id: currIndex++
	    }); 
	  };

	  for (let i = 0; i < 5; i++) {
	    this.addSlide(i);
	    console.log("text ",i," ", this.text[i]);
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

	}; //End constructor 
}

HomeController.$inject=['Map'];
export {HomeController};


