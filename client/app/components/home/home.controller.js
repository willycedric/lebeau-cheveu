
class HomeController {
  constructor() {

		//Carousel logic
	  this.myInterval = 5000;
	  this.noWrapSlides = false;
	  this.active = 0;
	  const slides = this.slides = [];
	  let currIndex = 0;

	  this.addSlide = function() {
	    const newWidth = 1280 + slides.length + 1;
	    slides.push({
	      image: 'http://lorempixel.com/' + newWidth + '/400',
	      text: ['Un style toujours dans l\'air du temps à des coûts défiants toutes concurences ...',
	      		 'Pas besoin de vous déplacer ni de prévoir du temps pour vos chercher le nécessaires pours vos coiffures ...',
	      		 ,'Leboncheveu est le choix gagnant de nombreuses femmes ...','Nos coiffeuses vous donnerons toujours le meilleur d\'elle même ...',
	      		 'Profiter de la tranquilité et du confort en vous faisant coiffer chez vous et à moindre coût ..'][slides.length%6],
	      id: currIndex++
	    });
	  };

	  for (let i = 0; i < 6; i++) {
	    this.addSlide();
	  }


	  //search bar logic
	  this.localionPlaceholder ="ville ou département";
	  this.hairdressTypePlaceholder="Type de coiffure";
	  this.hairdressTypes = ['Tresse 1','Tissage 1','Tresse 2','Tissage 2'];

	  // Date picker configuration
	  this.today = () =>{
	  	this.dt = new Date();
	  };
	  this.today();

	  this.clear = () =>{
	  		this.dt = null;
	  };

	  this.inlineOptions ={
	  	customClass:getDayClass,
	  	minDate: new Date(),
	  	showWeeks:true
	  };

	  this.dateOptions = {
	    dateDisabled: disabled,
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
	    startingDay: 1
	  };

	  //Disable weekend selection
	  const disabled =(data)=>{
	  	const date = data.date,
	  	mode = data.mode;
	  	return mode == 'day' && (date.getDay() === 0 || date.getDay() === 6);
	  }

	  this.toggleMin =()=>{
	  	this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
    	this.dateOptions.minDate = this.inlineOptions.minDate;
  	  };

	  this.toggleMin();

	   this.open1 = ()=> {
	    this.popup1.opened = true;
	  };

	  this.open2 = ()=> {
	    this.popup2.opened = true;
	  };


	  this.setDate = (year, month,day) =>{
	  	this.dt = new Date(year, month, day);
	  }
	  this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  this.format = this.formats[0];
	  this.altInputFormats = ['M!/d!/yyyy'];

	  this.popup1 = {
	    opened: false
	  };

	  this.popup2 = {
	    opened: false
	  };

	  const tomorrow = new Date();
	  tomorrow.setDate(tomorrow.getDate() + 1);
	  const afterTomorrow = new Date();
	  afterTomorrow.setDate(tomorrow.getDate() + 1);
	  this.events = [
	    {
	      date: tomorrow,
	      status: 'full'
	    },
	    {
	      date: afterTomorrow,
	      status: 'partially'
	    }
	  ];

	  const getDayClass = (data) => {
	    const date = data.date,
	      mode = data.mode;
	    if (mode === 'day') {
	      const dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (let i = 0; i < this.events.length; i++) {
	        const currentDay = new Date(this.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return this.events[i].status;
	        }
	      }
	    }

	    return '';
	  }

	}
}

export {HomeController};


