class LoginController {
  constructor($http,API,$window,User) {
    var self = this;
    self.token=null;
    self.url=`${API.url}`;
    
    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
   self.login = (data)=>{
    	$http({
    		data,
    		url:self.url+'/api/users/me',
    		method:'POST'
    	}).then(function loginSuccessCallBack(response){
            if(response.data.status =="ok"){              
                $http.defaults.headers.common['Authorization'] = 'JWT '+ response.data.token;
                User.pushUser(response.data.user);
                User.setLogged(true);
                $window.location.href=`${API.home}`;
            }else{
                console.log("There must be some errors during the authentication process");
            }
            //console.log("token: ",response.data);  
    	}, function loginErrorCallBack(err){
    		console.error(err);
    	});
    };

    /**
     * [description]
     * @return {[type]} [description]
     */
    self.me = () =>{
        $http({
            url:self.url+'/api/users/me',
            method:'GET'
        }).then(function getMeSuccessCallBack(response){
         //self.user = response.data;
         //User.addUser(response.data);
         console.log(JSON.stringify(self.user));        
        }, function getMeErrorCallBack(err){
            console.error(err);
        });
    };
    
    /**
     * [description]
     * @param  {[type]} data     [description]
     * @param  {[type]} userForm [description]
     * @return {[type]}          [description]
     */
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

    /**
     * [description]
     * @return {[type]} [description]
     */
    self.logout = () =>{
            $http({
                url:self.url+'/api/users/logout',
                method:'GET'
            })
            .then((response)=>{
                $http.defaults.headers.common['Authorization'] = '';
                User.pushUser({});
                $window.location.href=`${API.home}`;
            }, (err)=>{
                console.error(err);
            })
    };

  }//End constructor

}

LoginController.$inject = ['$http','API','$window','User'];

export {LoginController};


