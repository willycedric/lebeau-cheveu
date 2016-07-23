class LogoutController {
  constructor(User) {
  	this.greeting="logout";
  	console.log('Logout ', User.getUser(), User.getLogged());
   this.logout = () =>{
            $http({
                url:self.url+'/api/users/logout',
                method:'GET'
            })
            .then((response)=>{
                $http.defaults.headers.common['Authorization'] = '';
                User.pushUser({});
                User.setLoged(false);
                $window.location.href=`${API.home}`;
            }, (err)=>{
                console.error(err);
            })
    };
  }

}
LogoutController.$inject=['User'];
export {LogoutController};


