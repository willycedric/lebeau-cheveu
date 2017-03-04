
import {servicesAdminResourceModule} from './../../common/services/blogResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './blogs.tpl.html';
import './blog.scss';
angular.module('blogIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('blogIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('blogs', {
      url:'/blogs',
      template,
      controller: 'BlogsIndexCtrl',
      title: 'Blogs',
      resolve: {
        blogs: ['$q', '$location', '$log', 'securityAuthorization', 'blogResource', function($q, $location, $log, securityAuthorization, blogResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireUnProvilegedUser()
            .then(function(){
              //handles url with query(search) parameter
              return blogResource.findBlogs($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/home';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/home';
              $location.search({});
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const blogIndexModule = angular.module('blogIndexModule').controller('BlogsIndexCtrl', ['$scope', '$window', '$location', '$log', 'utility', 'blogResource','blogs','ModalFactory',
  function($scope, $window, $location, $log, utility, blogResource,blogs,ModalFactory){
    // local var
    var deserializeData = function(data){
      $scope.items = data.items;
      $scope.pages = data.pages;
      $scope.filters = data.filters;
      $scope.statuses = data.data;
      $scope.blogs = data.results.data;
    };


    $scope.redirectToBlogDetails = function(id){
      var redirectUrl;
      if(id){
        redirectUrl = '/blogs/'+id.toString();
      }else{
        redirectUrl='/blogs/';
      }
      $location.path(redirectUrl);
    }
    var fetchBlogs = function(){
      blogResource.findBlogs($scope.filters).then(function(data){
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