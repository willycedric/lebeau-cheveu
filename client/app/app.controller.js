import labels from '../../labels.json';
class AppController {
	constructor($window,$scope,API,Auth,AuthToken,$rootScope){
		this.$scope=$scope;
		this.labels =labels; //Label.init
		this.toggle=false;
		this.username="";
		this.transition = 'slide-in';
		$scope.this=this;
		var token=AuthToken.getToken();
		//keep the profile menu displayed on page reload
		if(token){
			this.toggle=true;
			this.username= AuthToken.parseToken(token).name;
		}else{
			this.toggle=false;
		}
		$scope.$on('connectionStatechanged',function(evt,user){				
			if(user){			
				$scope.this.toggle=true;
				$scope.this.username=user.data.userName;
			}else{
				$scope.this.toggle=false;
			}			
		});

		this.logout = () =>{
    		Auth.logout()
            .then(function logoutControllerSuccessCallback(response){   
                $rootScope.$broadcast('connectionStatechanged',null);           
                $window.location.href=`${API.home}`;
            },function logoutControllerErrorCallback(err){
                    console.error(err);
            });
        };

        
		
	};//end constructor
}

AppController.$inject=['$window','$scope','API','Auth','AuthToken','$rootScope'];
export {AppController};