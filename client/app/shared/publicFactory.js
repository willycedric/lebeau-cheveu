export const publicFactory = ($http, API) =>{
    let apiUrl=`${API.dev.homeUrl}`;
    const GetHomeGalleryEntries = () => {
       return  $http.get(apiUrl+'/api/public/home/entries');      

    }

    return {
        GetHomeGalleryEntries
    }
};
publicFactory.$inject =['$http','API'];