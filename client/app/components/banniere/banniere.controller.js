
class BanniereController {
  constructor() {
		  this.myInterval = 1000000;
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
		      		 ,'Leboncheveu est le choix gagnant de nombreuses femmes ...',
		      		 'Nos coiffeuses vous donnerons toujours le meilleur d\'elle même ...'][slides.length % 4],
		      id: currIndex++
		    });
		  };

		  for (var i = 0; i < 4; i++) {
		    this.addSlide();
		  }
	}
}

export {BanniereController};


