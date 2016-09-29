const locationFactory = ($http, API) =>{
	 const getLocation = (val) =>{
	 		return $http.get(API.location, {
		      params: {
		        address: val,
		        sensor: false
		      }
		    }).then(function(response){
		      return response.data.results.map(function(item){
		        return item.formatted_address;
		      });
		    });
	 };
	 return{
	 	getLocation
	 };
};

locationFactory.inject = ['$http','API'];
export {locationFactory};