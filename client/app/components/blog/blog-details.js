import {servicesBlogResourceModule} from './../common/services/blogResource';
import{securityAuthorizationModule} from './../common/security/authorization';
import uiRouter from 'angular-ui-router';
import template from './blog-details.tpl.html';
import _ from 'lodash';

angular.module('viewBlogDetailsModule', [
  uiRouter, 
  securityAuthorizationModule.name,
  servicesBlogResourceModule.name
  ]);
angular.module('viewBlogDetailsModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('blogdetails', {
      url:'/blogs/details/:id',
      template,
      controller: 'BlogDetailCtrl',
      title: 'Blogs / Details',
      resolve: {
        blogs: ['$q', '$stateParams', '$location', 'securityAuthorization', 'blogResource', function($q, $stateParams, $location, securityAuthorization, blogResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireUnPrivilegedUser()
            .then(function(){
              var id = $stateParams.id || '';
              if(id){
                return blogResource.read(id);
              }else{
                redirectUrl = '/blogs';
                return $q.reject();
              }
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/account';
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      }
    });
}]);
export const viewBlogDetailsModule =  angular.module('viewBlogDetailsModule').controller('BlogDetailCtrl', ['$scope', '$q','$route', '$location', 'utility', 'blogResource','$log', '$stateParams','blogs',
  function($scope, $q,$route, $location, utility, blogResource, $log,$stateParams,data) {

    var deserializeData = function(data){ 
      $scope.relatedBlogs=[];
      var deferred = $q.defer(); 
      if(data.hasOwnProperty('record')){
        deserializeBlog(data.record)
        .then(function(response){
           deferred.resolve(response.results);
        });       
        return deferred.promise;
      }
      else{
        deserializeBlog(data).then(function(response){
           deferred.resolve(response.results);
        });
        return deferred.promise;
      }
    };

    var deserializeBlog = function(blog){
      $scope.blog = blog;
      gerRelatedAuthors(blog);
      return getRelatedBlogs(blog);
    };

    //Get related blogs posts
    var getRelatedBlogs = function(obj){
      return blogResource.relatedCategory(obj.category.id);      
    };


    //Get related authors

    var gerRelatedAuthors = function(obj){
       blogResource.sameAuthor(obj.userCreated.id)
       .then(function(rep){
         authorSlide(rep.results);
       });
    };

    deserializeData(data)
    .then (function(blogs){        
        categorySlide(blogs);
    });
    
    $scope.redirectToArticleView = function(id){
      var redirectUrl="";
      if(id!=null){
          redirectUrl = "/blogs/details/"+id.toString();
          $location.path(redirectUrl);
      }else{
        $location.path("/blogs");
       throw new Error ("the blog id cannot be equal to null");
      }
    };



    var categorySlide = function (blogs){
        var currentIndex = 0;
        _.remove(blogs, function(blog){
          return blog._id === $stateParams.id;
        });
        $scope.relatedLength = blogs.length;       
        $scope.currentBlog = blogs[currentIndex];
        $scope.hasPrev = function(){
          var test =currentIndex>0?true:false;
          return test;
        };
        $scope.hasNext = function(){

          var test = (currentIndex < (blogs.length-1))?true:false;
          return test;
        };
        $scope.prev = function(){
          if($scope.hasPrev()){            
            currentIndex--;
            $scope.currentBlog = blogs[currentIndex];
            $scope.hasPrev();
            $scope.hasNext();
          }
        };        
        $scope.next = function(){
          if($scope.hasNext()){           
            currentIndex++;
            $scope.currentBlog = blogs[currentIndex];
            $scope.hasPrev();
            $scope.hasNext();
          }
        };
    };


    var authorSlide = function (blogs){
        var currentIndex = 0;
        _.remove(blogs, function(blog){
          return blog._id === $stateParams.id;
        });
        $scope.relatedAuthorLength = blogs.length;       
        $scope.currentAuthorBlog = blogs[currentIndex];
        $scope.authorHasPrev = function(){
          var test =currentIndex>0?true:false;
          return test;
        };
        $scope.authorHasNext = function(){

          var test = (currentIndex < (blogs.length-1))?true:false;
          return test;
        };
        $scope.authorPrev = function(){
          if($scope.authorHasPrev()){            
            currentIndex--;
            $scope.currentBlog = blogs[currentIndex];
            $scope.authorHasPrev();
            $scope.authorHasPrev();
          }
        };        
        $scope.authorNext = function(){
          if($scope.authorHasNext()){           
            currentIndex++;
            $scope.currentBlog = blogs[currentIndex];
            $scope.authorHasPrev();
            $scope.authorHasPrev();
          }
        };
    };
    
    
    
  }
]);