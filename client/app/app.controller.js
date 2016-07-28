import labels from '../../labels.json';
class AppController {
	constructor($window,$scope,API){
		this.$scope=$scope;
		this.labels =labels; //Label.init
		this.toggle=false;
		this.username="";
		$scope.this=this;	
		//keep the profile menu displayed on page reload
		if($window.sessionStorage['user']){
			this.toggle=true;
			this.username= JSON.parse($window.sessionStorage['user']).user.userName;
		}
		$scope.$on('connectionStatechanged',function(evt,user){		
				
			if(user){			
				$scope.this.toggle=true;
				$scope.this.username=user.data.userName;
			}else{
				$scope.this.toggle=false;
			}			
		});
		
	};//end constructor
}

AppController.$inject=['$window','$scope','API'];
export {AppController};