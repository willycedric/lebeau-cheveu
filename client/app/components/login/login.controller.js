class LoginController {
  constructor($http,API,$window) {
    var self = this;
    self.token=null;
    self.url=`${API.url}`;
    self.user={email:"w@game.fr",password:"root"};

   self.login = (data)=>{
     console.log(self.user);
    	$http({
    		data,
    		url:self.url+'/api/users/me',
    		method:'POST'
    	}).then(function loginSuccessCallBack(response){
            if(response.data.status =="ok"){              
                $http.defaults.headers.common['Authorization'] = 'JWT '+ response.data.token;
                self.user= response.data.user;
                $window.location.href=`${API.home}`;
            }else{
                console.log("There must be some errors during the authentication process");
            }
            //console.log("token: ",response.data);  
    	}, function loginErrorCallBack(err){
    		console.error(err);
    	});
    };


    self.me = () =>{
        $http({
            url:self.url+'/api/users/me',
            method:'GET'
        }).then(function getMeSuccessCallBack(response){
         self.user = response.data; 
         console.log(JSON.stringify(self.user));        
        }, function getMeErrorCallBack(err){
            console.error(err);
        });
    };



    

    self.addUser = (data, userForm)=>{
        if(userForm.$valid){
            console.log(JSON.stringify(data));
            $http({
                url:self.url+'/api/users',
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

    self.logout = () =>{
            $http({
                url:self.url+'/api/users/logout',
                method:'GET'
            })
            .then((response)=>{
                $http.defaults.headers.common['Authorization'] = '';
            }, (err)=>{
                console.error(err);
            })
    };

  }//End constructor

  setUser(user){
    self.user=user;
  }


}

LoginController.$inject = ['$http','API','$window'];

export {LoginController};


