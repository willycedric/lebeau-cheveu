class ShowhairdresserprofileController {
  constructor($stateParams,Auth,$scope,AuthToken,$window,API,$log) {
     $scope.this =this;
    this._id = $stateParams.id;
    this.openingHourList=["9h:00","10h:00","11h:00","12h:00","13h:00","14h:00","15h:00","16h:00","17h:00","18h:00","19h:00"];
    Auth.getHairdresserById(this._id)
    .then(function ShowhairdresserprofileControllerSuccessCallback(response){
      $log.log(response);
        $scope.this.hairdresser = response;
         $scope.this.days = new Array();
         $scope.this.times = new Array();
        angular.forEach(response.customerAppointment,function(resp,key){
            $scope.this.days.push(resp.dayOfWeek);
            $scope.this.times[key] = new Array();
            $scope.this.times[key].push(resp.appointmentSlot);           
        });
    }, function ShowhairdresserprofileControllerFailureCallback(err){
        console.error(err);
    });

    this.rowClicked = function(val){
      if(AuthToken.getToken()){
         if(val == 0){
          console.log('Hairdresser dispo');
         }else{
          console.log('Hairdresser rsv');
         }
      }else{
          //prompt the user to register or login  
          $window.location.href=`${API.dev.login}`
          //user must be sent back to the hairdresser profile
      }
    };

}//end constructor
}

ShowhairdresserprofileController.$inject=['$stateParams','Auth','$scope','AuthToken','$window','API','$log'];
export {ShowhairdresserprofileController};


