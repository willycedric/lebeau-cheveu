class HairdressersController {
  constructor(Auth,$scope) {
    //this.url = "http://res.cloudinary.com/hgtagghpz/image/upload/v1475178147/placeholder_uavhxj.png";
  	$scope.this = this;
   Auth.getAllHairdressers()
   .then(function HairdressersControllerSuccessCallback (response){
   		//console.log(response);
   		$scope.this.hairdressers = response;
      //console.log($scope.this.hairdressers[0]._id);
   }, function HairdressersControllerFailureCallback (err){
   		console.error(err);
   });
  
  }//end constructor

}

HairdressersController.$inject =['Auth','$scope'];
export {HairdressersController};


