export const api = {
	dev:{
		homeUrl:'http://localhost:3000',
		home:'http://localhost:4500/#/home',
		error:'http://localhost:4500/#/error',
		customerRoute:'/api/users',
		hairdresserRoute:'/api/hairdressers',
        openingHourList:["9h:00","12h:00","15h:00","18h:00","21h:00"]
	},
	test:{
		homeUrl:'https://lebeaucheveu-bachend.herokuapp.com',
		home:'https://lebeaucheveu.herokuapp.com/#/home',
		error:'https://lebeaucheveu.herokuapp.com/#/error'
	},
	location:'//maps.googleapis.com/maps/api/geocode/json',
	log:true
};