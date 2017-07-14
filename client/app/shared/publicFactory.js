export const publicFactory = ($http, API) =>{
    let apiUrl=`${API.dev.homeUrl}`;    
    const GetHomeGalleryEntries = () => {
       return  $http.get(apiUrl+'/api/public/home/entries');      

    }

    const GetListOfAvailableHaircutCatalogs = () => {
        return $http.get(apiUrl+'/api/public/haircut/catalogs');
    }

    return {
        GetHomeGalleryEntries,
        GetListOfAvailableHaircutCatalogs
    }
};
publicFactory.$inject =['$http','API'];