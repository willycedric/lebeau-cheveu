
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-blogs.tpl.html';
import './admin-blog.scss';
angular.module('adminBlogsIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminBlogsIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('adminblogs', {
      url:'/admin/blogs',
      template,
      controller: 'BlogsIndexCtrl',
      title: 'Manage Blogs',
      resolve: {
        blogs: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.findBlogs($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      },
      reloadOnSearch: false
    });
}]);
export const adminBlogsIndexModule = angular.module('adminBlogsIndexModule').controller('BlogsIndexCtrl', ['$scope', '$window', '$location', '$log', 'utility', 'adminResource','blogs','ModalFactory',
  function($scope, $window, $location, $log, utility, adminResource,blogs,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.statuses = data.data;
      $scope.blogs = data.results.data;
      $scope.categories =[];
      availableCategories();
    };


    $scope.redirectToBlogDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl = '/admin/blog/'+id.toString();
      }else{
        redirectUrl='/admin/blogs/';
      }
      $location.path(redirectUrl);
    }
    var fetchBlogs = function(){
      adminResource.findBlogs($scope.filters).then(function(data){
        deserializeData(data);

        //update url in browser addr bar
        $location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };

    // $scope methods
    $scope.canSave = utility.canSave;
    $scope.filtersUpdated = function(){
      //reset pagination after filter(s) is updated
      $scope.filters.page = undefined;
      fetchBlogs();
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchStatuses();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchStatuses();
    };
    $scope.addBlog = function(param){      
      adminResource.addBlog(param).then(function(data){
        $scope.add = {};
        if(data.success){
          $window.location.reload();
        }else if (data.errors && data.errors.length > 0){
          alert(data.errors[0]);
        }else {
          alert('unknown error.');
        }
      }, function(e){
        $scope.add = {};
        $log.error(e);
      });
    };

    $scope.LaunchAddBlogForm = function(){
      ModalFactory.trigger(this, "newBlog.html",function($uibModalInstance,topController){
        this.categories = topController.categories;
        this.addBlog = function(data){          
          if(!angular.equals({}, data)){
            data.isPublished = (data.isPublished===true)?true:false;
            //topController.data = data;
            topController.addBlog(data);
          }else{
            throw new Error('there is no parameter entered');
          }         
          //topController.addBlog();
          $uibModalInstance.close('OK');
        };

        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        this.canSave = function(ngFormCtrl){
          console.log('inside this function');
            return  ngFormCtrl.$dirty && ngFormCtrl.$valid;
        };
        this.change = function(data){
          console.log(JSON.stringify(data));
        }
      });
    };

    var availableCategories = function(){
      adminResource.findBlogCategories()
      .then((data)=>{
        if(!angular.equals({},data)){
          angular.forEach(data.data, (category)=>{            
            $scope.categories.push({name:category.name, _id:category._id});
         });
        }else{
          $scope.categories =["empty"];
        }
         
      });
        
    };

   

    // $scope vars
    //select elements and their associating options
    $scope.sorts = [
      {label: "id \u25B2", value: "_id"},
      {label: "id \u25BC", value: "-_id"},
      {label: "name \u25B2", value: "name"},
      {label: "name \u25BC", value: "-name"}
    ];    
    
    $scope.limits = [
      {label: "10 items", value: 10},
      {label: "20 items", value: 20},
      {label: "50 items", value: 50},
      {label: "100 items", value: 100}
    ];

    //initialize $scope variables
    deserializeData(blogs);
    //load availables categories
     
  }
]);