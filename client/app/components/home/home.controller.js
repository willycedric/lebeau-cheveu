
class HomeController {
  constructor() {

  		//Carousel logic
		  this.myInterval = 5000;
		  this.noWrapSlides = false;
		  this.active = 0;
		  var slides = this.slides = [];
		  var currIndex = 0;

		  this.addSlide = function() {
		    var newWidth = 1280 + slides.length + 1;
		    slides.push({
		      image: 'http://lorempixel.com/' + newWidth + '/400',
		      text: ['Un style toujours dans l\'air du temps à des coûts défiants toutes concurences ...',
		      		 'Pas besoin de vous déplacer ni de prévoir du temps pour vos chercher le nécessaires pours vos coiffures ...',
		      		 ,'Leboncheveu est le choix gagnant de nombreuses femmes ...','Nos coiffeuses vous donnerons toujours le meilleur d\'elle même ...',
		      		 'Profiter de la tranquilité et du confort en vous faisant coiffer chez vous et à moindre coût ..'][slides.length%6],
		      id: currIndex++
		    });
		  };

		  for (var i = 0; i < 6; i++) {
		    this.addSlide();
		  }
	  //search bar logic
	  this.localionPlaceholder ="Veuillez renseigner votre ville ou département";
	  this.hairdressTypePlaceholder="Type de coiffure";
	  this.hairdressTypes = ['Tresse 1','Tissage 1','Tresse 2','Tissage 2'];
	}
}

export {HomeController};


