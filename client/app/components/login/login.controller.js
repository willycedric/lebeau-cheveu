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

    this.addUser = (data, userForm)=>{
        if(userForm.$valid){
            console.log(JSON.stringify(data));
            $http({
                url:'http://localhost:3000/api/users',
                method:'POST',
                data:data
            })
            .then( (response)=>{
                console.log(JSON.stringify(response.data));
            },(err)=>{
                console.error(err);
            });
        }
    };

    this.logout = () =>{
            console.log("Inside the logout function ");
            $http({
                url:"http://localhost:3000/api/users/logout",
                method:'GET'
            })
            .then((response)=>{
                console.log("User logout successfull");
            }, (err)=>{
                console.error(err);
            })

    };

  }//End constructor

}

LoginController.$inject = ['$http'];

export {LoginController};


