class HairdressersController {
  constructor(Auth,$scope) {
    //this.url = "http://res.cloudinary.com/hgtagghpz/image/upload/v1475178147/placeholder_uavhxj.png";
  	$scope.this = this;
    $scope.this.hairdresserList=new Array();

   Auth.getAllHairdressers(0)
   .then(function HairdressersControllerSuccessCallback (response){
      response.map((hairdresser)=>{
          $scope.this.hairdresserList.push(hairdresser);
      });    
   }, function HairdressersControllerFailureCallback (err){
   		console.error(err);
   });

   this.loadMore = () =>{
    var numberOfAlreadyDisplayed = $scope.this.hairdresserList.length;

     Auth.getAllHairdressers(numberOfAlreadyDisplayed)
       .then(function HairdressersControllerSuccessCallback (response){
         response.map((hairdresser)=>{
            $scope.this.hairdresserList.push(hairdresser);
        });
       }, function HairdressersControllerFailureCallback (err){
          console.error(err);
       });
   };
  
  }//end constructor

}

HairdressersController.$inject =['Auth','$scope'];
export {HairdressersController};


