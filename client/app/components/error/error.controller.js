class ErrorController {
  constructor($scope) {
  		
  		$scope.$on('onUnauthorizedRequestEvent', function(evt,status){
  			console.log('unauthorized request detected',status.code);
  		});
   
  }

}
ErrorController.$inject = ['$scope'];
export {ErrorController};


