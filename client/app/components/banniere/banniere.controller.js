
class BanniereController {
  constructor() {
		  this.myInterval = 5000;
		  this.noWrapSlides = false;
		  this.active = 0;
		  var slides = this.slides = [];
		  var currIndex = 0;

		  this.addSlide = function() {
		    var newWidth = 900 + slides.length + 1;
		    slides.push({
		      image: 'http://lorempixel.com/' + newWidth + '/400',
		      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
		      id: currIndex++
		    });
		  };

		  for (var i = 0; i < 4; i++) {
		    this.addSlide();
		  }
	}
}

export {BanniereController};


