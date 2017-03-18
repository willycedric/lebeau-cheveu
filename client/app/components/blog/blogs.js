
import {servicesBlogResourceModule} from './../common/services/blogResource';
import{securityAuthorizationModule} from './../common/security/authorization';
import {servicesBlogCategoryResourceModule} from './../common/services/blogCategoryResource';
import uiRouter from 'angular-ui-router';
import template from './blogs.tpl.html';
import _ from 'lodash';
import './blog.scss';
angular.module('blogIndexModule', [uiRouter, securityAuthorizationModule.name,
     servicesBlogResourceModule.name,
     servicesBlogCategoryResourceModule.name
     ]);
angular.module('blogIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('blogs', {
      url:'/blogs',
      template,
      controller: 'ReadBlogsIndexCtrl',
      title: 'Blogs',
      resolve: {
        blogs: ['$q', '$location', '$log', 'securityAuthorization', 'blogResource', function($q, $location, $log, securityAuthorization, blogResource){                   
          var redirectUrl;
          var promise = securityAuthorization.requireUnPrivilegedUser()
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
export const blogIndexModule = angular.module('blogIndexModule').controller('ReadBlogsIndexCtrl', ['$scope', '$state','$window', '$location', '$log', 'blogResource','blogs','blogCategoryResource',
  function($scope,$state, $window, $location, $log, blogResource,blogs,blogCategoryResource){
    // local var
    var deserializeData = function(data){
      $scope.items = data.results.items;
      $scope.pages = data.results.pages;
      $scope.filters = data.results.filters;
      $scope.statuses = data.statuses;
      $scope.blogs=data.results.data;
      $scope.authors=[];
      $scope.categories=[];       
      //Get the list of post authors      
      blogResource.findBlogs()
      .then(function(rep){
        if(rep.results.data.length!=0)
        {
          angular.forEach(rep.results.data, function(blog, ind){  
            if($scope.authors.indexOf(blog.userCreated.name)==-1){              
              $scope.authors.push(blog.userCreated.name);
            }                                     
          });
        }
      });
      //Get the list of category        
      blogCategoryResource.findBlogCategories()
      .then(function(obj){
        $scope.categories = obj.results.data;        
      });
      $location.search($scope.filters);
    };



    $scope.redirectToArticleView = function(id){
      //debugger;
      var redirectUrl;      
      if(id){
        redirectUrl = '/blogs/details/'+id.toString();        
      }else{
        redirectUrl='/blogs';
      }
      $location.path(redirectUrl);
     
    }
    var fetchBlogs = function(){
      blogResource.findBlogs($scope.filters).then(function(data){
        deserializeData(data);

        //update url in browser addr bar
        //$location.search($scope.filters);
      }, function(e){
        $log.error(e);
      });
    };
  
    // $scope methods
    $scope.filtersUpdated = function(parameter,option){
      option = typeof option !== 'undefined'?option:"search";
      if(parameter !== null){
        $log.debug("parameter -->", parameter);
        //reset pagination after filter(s) is updated
        switch(option){
          case 'author':        
            $scope.filters.author = parameter
            $scope.filters.page = undefined;
            fetchBlogs();
          break;
          case 'category':          
            $scope.filters.category = parameter
            $scope.filters.page = undefined;
            fetchBlogs();
          break;
          case 'search':
            $scope.filters.search = parameter;
            $scope.filters.page = undefined;
            fetchBlogs();
          break;
          default:
            throw new Error("the selected option "+option+" is not defined");
          break;
        };
     }
    };
    $scope.prev = function(){
      $scope.filters.page = $scope.pages.prev;
      fetchBlogs();
    };
    $scope.next = function(){
      $scope.filters.page = $scope.pages.next;
      fetchBlogs();
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