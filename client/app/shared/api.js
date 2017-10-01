export const api = {
	// dev:{
	// 	homeUrl:'http://localhost:3500',
	// 	home:'https://lebeaucheveu.herokuapp.com/#/home/',
	// 	error:'http://localhost:4500/#/error',
	// 	customerRoute:'/api/account',
	// 	hairdresserRoute:'/api/hairdresser',
    //     openingHourList:["9h:00","12h:00","15h:00","18h:00","21h:00"]		
	// },
	dev:{
		homeUrl:'https://lebeaucheveu-api.herokuapp.com',
		home:'https://lebeaucheveu.herokuapp.com',
		customerRoute:'/api/account',
		hairdresserRoute:'/api/hairdresser',
		openingHourList:["9h:00","12h:00","15h:00","18h:00","21h:00"]
	},
	/*test:{
		homeUrl:'https://lebeaucheveu-bachend.herokuapp.com',
		home:'https://lebeaucheveu.herokuapp.com/#/home',
		error:'https://lebeaucheveu.herokuapp.com/#/error'
	}*/
	test:{
		homeUrl:'http://localhost:3000/',
		home:'http://localhost:4500/',
		customerRoute:'/api/users',
		hairdresserRoute:'/api/hairdressers'
	},
	location:'//maps.googleapis.com/maps/api/geocode/json',
	log:true
};

//AIzaSyCkUOdZ5y7hMm0yrcCQoCvLwzdM6M8s5qk
//AIzaSyBGsbEKC8lC5RirMa0N1n60YBL3503d6TY -> good
//AIzaSyBGsbEKC8lC5RirMa0N1n60YBL3503d6TY