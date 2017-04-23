export const servicesAdminResourceModule = angular.module('servicesAdminResourceModule', []).factory('adminResource', ['$http', '$q','API', function ($http, $q,API) {
  // local variable
  const baseUrl =`${API.dev.homeUrl}`+'/api';
  var userUrl = baseUrl + '/admin/users';
  var accountUrl = baseUrl + '/admin/accounts';
  var hairdresserUrl = baseUrl+'/admin/hairdressers';
  var administratorUrl = baseUrl + '/admin/administrators';
  var adminGroupUrl = baseUrl + '/admin/admin-groups';
  var adminStatusesUrl = baseUrl + '/admin/statuses';
  var adminCategoriesUrl = baseUrl + '/admin/categories';
  var adminBlogsUrl = baseUrl + '/admin/blogs';
  var adminBlogCategoryUrl = baseUrl + '/admin/blog-category';
  var adminCatalogUrl = baseUrl+'/admin/catalogs';
  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
  resource.getStats = function(){
    return $http.get(baseUrl + '/admin').then(processResponse, processError);
  };
 
  resource.getStatus = function(){
    return $http.get(baseUrl+'/admin/statuses').then(processResponse, processError);
  }
  resource.search = function(query){
    return $http.get(baseUrl + '/admin/search', { params: { q: query }} ).then(processResponse, processError);
  };

  // ----- users api -----
  resource.findUsers = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(userUrl, { params: filters }).then(processResponse, processError);
  };


  resource.addUser = function(username){
    return $http.post(userUrl, { username: username }).then(processResponse, processResponse);
  };

  resource.findUser = function(_id){
    var url = userUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
 
  resource.updateUser = function(_id, data){
    var url = userUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
 
  resource.setPassword = function(_id, data){
    var url = userUrl + '/' + _id + '/password';
    return $http.put(url, data).then(processResponse, processError);
  };


  resource.linkAdmin = function(_id, data){
    var url = userUrl + '/' + _id + '/role-admin';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.unlinkAdmin = function(_id){
    var url = userUrl + '/' + _id + '/role-admin';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.linkAccount = function(_id, data){
    var url = userUrl + '/' + _id + '/role-account';
    return $http.put(url, data).then(processResponse, processError);
  };
   resource.linkHairdresser = function(_id, data){
    var url = hairdresserUrl + '/' + _id + '/role-account';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.unlinkAccount = function(_id){
    var url = userUrl + '/' + _id + '/role-account';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.unlinkHairdresser = function(_id){
    var url = hairdresserUrl + '/' + _id + '/role-account';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.deleteUser = function(_id){
    var url = userUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };



  // ----- accounts api -----
  resource.findAccounts = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(accountUrl, { params: filters }).then(processResponse, processError);
  };


  resource.addAccount = function(fullname){
    return $http.post(accountUrl, { 'name.full': fullname }).then(processResponse, processResponse);
  };

 
  resource.findAccount = function(_id){
    var url = accountUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };



  resource.updateAccount = function(_id, data){
    var url = accountUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };

 

  resource.linkAccontUser = function(_id, data){
    return $http.put(url, data).then(processResponse, processError);
  };

 
  resource.unlinkAccountUser = function(_id){
    var url = accountUrl + '/' + _id + '/user';
    return $http.delete(url).then(processResponse, processError);
  };


  resource.newAccountNote = function(_id, data){
    var url = accountUrl + '/' + _id + '/notes';
    return $http.post(url, data).then(processResponse, processError);
  };
 
  resource.newAccountStatus = function(_id, data){
    var url = accountUrl + '/' + _id + '/status';
    return $http.post(url, data).then(processResponse, processError);
  };

 
  resource.deleteAccount = function(_id){
    var url = accountUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };


  //-------- hairdressers api ------------
    resource.findHairdressers = function(filters){
      if(angular.equals({}, filters)){
        filters = undefined;
      }
      return $http.get(hairdresserUrl, { params: filters }).then(processResponse, processError);
    };
    resource.addHairdresser = function(fullname){
      return $http.post(hairdresserUrl, { 'name.full': fullname }).then(processResponse, processResponse);
    };
    resource.findHairdresser = function(_id){
      var url = hairdresserUrl + '/' + _id;
      return $http.get(url).then(processResponse, processError);
    };
   resource.updateHairdresser = function(_id, data){
      var url = hairdresserUrl + '/' + _id;
      return $http.put(url, data).then(processResponse, processError);
    };
   resource.linkHairdresserUser = function(_id, data){
      var url = hairdresserUrl + '/' + _id + '/user';
      return $http.put(url, data).then(processResponse, processError);
    }; 

    resource.unlinkHairdresserUser = function(_id){
      var url = hairdresserUrl + '/' + _id + '/user';
      return $http.delete(url).then(processResponse, processError);
    };

   resource.newHairdresserNote = function(_id, data){
      var url = hairdresserUrl + '/' + _id + '/notes';
      return $http.post(url, data).then(processResponse, processError);
    };

   resource.newHairdresserStatus = function(_id, data){
      var url = hairdresserUrl + '/' + _id + '/status';
      return $http.post(url, data).then(processResponse, processError);
    };

   resource.deleteHairdresser = function(_id){
      var url = hairdresserUrl + '/' + _id;
      return $http.delete(url).then(processResponse, processError);
    };
    
  // ----- administrators api -----
  resource.findAdministrators = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(administratorUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addAdministrator = function(fullname){
    return $http.post(administratorUrl, { 'name.full': fullname }).then(processResponse, processResponse);
  };
  resource.findAdministrator = function(_id){
    var url = administratorUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateAdministrator = function(_id, data){
    var url = administratorUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.adminLinkUser = function(_id, data){
    var url = administratorUrl + '/' + _id + '/user';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.adminUnlinkUser = function(_id){
    var url = administratorUrl + '/' + _id + '/user';
    return $http.delete(url).then(processResponse, processError);
  };
  resource.saveAdminGroups = function(_id, data){
    var url = administratorUrl + '/' + _id + '/groups';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.saveAdminPermissions = function(_id, data){
    var url = administratorUrl + '/' + _id + '/permissions';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteAdministrator = function(_id){
    var url = administratorUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- admin-groups api -----
  resource.findAdminGroups = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminGroupUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addAdminGroup = function(name){
    return $http.post(adminGroupUrl, { name: name }).then(processResponse, processResponse);
  };
  resource.findAdminGroup = function(_id){
    var url = adminGroupUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateAdminGroup = function(_id, data){
    var url = adminGroupUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.saveAdminGroupPermissions = function(_id, data){
    var url = adminGroupUrl + '/' + _id + '/permissions';
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteAdminGroup = function(_id){
    var url = adminGroupUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- statuses api -----
  resource.findStatuses = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminStatusesUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addStatus = function(data){
    return $http.post(adminStatusesUrl, data).then(processResponse, processResponse);
  };
  resource.findStatus = function(_id){
    var url = adminStatusesUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateStatus = function(_id, data){
    var url = adminStatusesUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteStatus = function(_id){
    var url = adminStatusesUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };
// ----- blogs  api -----
  resource.findBlogs = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminBlogsUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addBlog = function(data){
    return $http.post(adminBlogsUrl, data).then(processResponse, processResponse);
  };
  resource.findBlog = function(_id){
    var url = adminBlogsUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateBlog = function(_id, data){
    var url = adminBlogsUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteBlog = function(_id){
    var url = adminBlogsUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };

  // ----- blogs categories  api -----
  resource.findBlogCategories = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminBlogCategoryUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addBlogCategory = function(data){
    return $http.post(adminBlogCategoryUrl, data).then(processResponse, processResponse);
  };
  resource.findBlogCategory = function(_id){
    var url = adminBlogCategoryUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateBlogCategory = function(_id, data){
    var url = adminBlogCategoryUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteBlogCategory = function(_id){
    var url = adminBlogCategoryUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };
  // ------- catalogs api -----------
   resource.findCatalogs = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminCatalogUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addCatalog = function(data){
    return $http.post(adminCatalogUrl, data).then(processResponse, processResponse);
  };
  resource.findCatalog = function(_id){
    var url = adminCatalogUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateCatalog = function(_id, data){
    var url = adminCatalogUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteCatalog = function(_id){
    var url = adminCatalogUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };
  // ----- categories api -----
  resource.findCategories = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(adminCategoriesUrl, { params: filters }).then(processResponse, processError);
  };
  resource.addCategory = function(data){
    return $http.post(adminCategoriesUrl, data).then(processResponse, processResponse);
  };
  resource.findCategory = function(_id){
    var url = adminCategoriesUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };
  resource.updateCategory = function(_id, data){
    var url = adminCategoriesUrl + '/' + _id;
    return $http.put(url, data).then(processResponse, processError);
  };
  resource.deleteCategory = function(_id){
    var url = adminCategoriesUrl + '/' + _id;
    return $http.delete(url).then(processResponse, processError);
  };
  return resource;
}]);
