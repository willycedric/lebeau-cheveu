class ErrorController {
  constructor($rootScope) {
  		
  		$rootScope.$on('alreadyRegistered', function(evt,status){
  			console.log('user already Registered',status);
  		});
   
  }

}
ErrorController.$inject = ['$rootScope'];
export {ErrorController};


