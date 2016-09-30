class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope) {
  	 $scope.this =this;
    this._id = $stateParams.id;

    Auth.getHairdresserById(this._id)
    .then(function ShowhairdresserprofileControllerSuccessCallback(response){
    	$scope.this.hairdresser = response;
    	console.log(JSON.stringify(response));
    }, function ShowhairdresserprofileControllerFailureCallback(err){
    	console.error(err);
    });
}//end constructor
}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope'];
export {ShowhairdresserprofileController};


