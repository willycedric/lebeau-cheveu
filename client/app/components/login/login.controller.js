class LoginController {
  constructor($http) {
    this.token=null;
    
  	//labels
    this.user = {email:"none",password:"none"};
    console.log(this.user.email);
    this.login = function(data){
        console.log(data);
    	$http({
    		data,
    		url:'http://localhost:3000/api/users/me',
    		method:'POST'
    	}).then(function successCallBack(response){
            $http.defaults.headers.common['Authorization'] = 'JWT '+ response.data.token;
    	}, function errorCallBack(err){
    		console.error(err);
    	});
    };
    console.log("token received ", this.token);

    this.getMe = function(){
        $http({
            url:'http://localhost:3000/api/users/me',
            method:'GET'
        }).then(function successCallBack(response){
            console.log(JSON.stringify(response.data));
        }, function errorCallBack(err){
            console.error(err);
        });
    };
  }

}

LoginController.$inject = ['$http'];

export {LoginController};


