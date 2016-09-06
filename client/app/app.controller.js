import labels from '../../labels.json';
class AppController {
	constructor($window,$scope,API,Auth,AuthToken,$rootScope){
		this.$scope=$scope;
		this.labels =labels; //Label.init
		this.toggle=false;
		//User displayed in the menu
		this.username="";
		//Use to trigger the view transition animation
		this.transition = 'slide-in';
		//boolean set to true if the logged user match the role described by the boolean
		// this.isCustomer=false;
		// this.isHairdresser=false;
		// this.isAdmin=false;
		$scope.this=this;
		var token=AuthToken.getToken();
		//keep the profile menu displayed on page reload
		if(token){
			this.toggle=true;
			this.username= AuthToken.parseToken(token).name;
			//Toggle the right profile link in the menu based on the user role on page reload
			switch(AuthToken.parseToken(token).role){
				case 0:
					$scope.this.isAdmin=true;
				break;
				case 1:
					$scope.this.isHairdresser=true;
				break;
				case 2:
					$scope.this.isCustomer=true;
				break;
				default:
					console.error('There are some erros with the user role in the appController');
				break;
			}
		}else{
			this.toggle=false;
		}
		$scope.$on('connectionStatechanged',function(evt,user){				
			if(user){			
				$scope.this.toggle=true;
				$scope.this.username=user.data.userName;
				//Toggle the right profile link in the menu based on the user role 
				//console.log(JSON.stringify(user.data));
				switch(user.data.role){
					case 0:
						$scope.this.isAdmin=true;
					break;
					case 1:
						$scope.this.isHairdresser=true;
					break;
					case 2:
						$scope.this.isCustomer=true;
					break;
					default:
						console.error('There are some erros with the user role in the appController');
					break;
				}
			}else{
				$scope.this.toggle=false;
			}			
		});

		this.logout = () =>{
    		Auth.logout()
            .then(function logoutControllerSuccessCallback(response){   
                $rootScope.$broadcast('connectionStatechanged',null);
                //set the role based profile trigger at false
                $scope.this.isAdmin=$scope.this.isHairdresser=$scope.this.isCustomer=false;      
                $window.location.href=`${API.dev.home}`;
            },function logoutControllerErrorCallback(err){
                    console.error(err);
            });
        };

       
	};//end constructor
}

AppController.$inject=['$window','$scope','API','Auth','AuthToken','$rootScope'];
export {AppController};