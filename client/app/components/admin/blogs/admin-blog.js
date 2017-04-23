
import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
//import textAngularRangy from 'textangular/dist/textAngular-rangy.min.js';
import textAngularSanitize from 'textangular/dist/textAngular-sanitize.min.js';
import textAngular from 'textangular/dist/textAngular.min.js';
//import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import template from './admin-blog.tpl.html';
angular.module('adminBlogsDetailModule', [uiRouter,textAngular,securityAuthorizationModule.name,
     servicesUtilityModule.name, 
     servicesAdminResourceModule.name]);
angular.module('adminBlogsDetailModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('/adminblogdetail', {
      url:'/admin/blog/:id',
      template,
      controller: 'AdminBlogsDetailCtrl',
      resolve: {
        data: ['$q', '$stateParams', '$location', 'securityAuthorization', 'adminResource', function($q, $stateParams, $location, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              var id = $stateParams.id || '';
              if(id){
                return adminResource.findBlog(id);
              }else{
                redirectUrl = '/admin/blogs';
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
      },
      title: 'Blogs / Details'
    });
}]);
angular.module('adminBlogsDetailModule').config(['$compileProvider', function($compileProvider){

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|http?):/);

}]);
export const adminBlogsDetailModule = angular.module('adminBlogsDetailModule').controller('AdminBlogsDetailCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'adminResource','data','ModalFactory',
  function($scope, $route, $location, $log, utility, adminResource, data,ModalFactory) {
    $scope.htmlcontent = data.record.content;

    var deserializeData = function(data){      
      if(data.hasOwnProperty('record'))
        deserializeBlog(data.record);
      else
        deserializeBlog(data);
    };

    var deserializeBlog = function(blog){
      $scope.blog = blog;
      $scope.categories =[];
      //category default value
      $scope.categories.push({
        id:0,
        name:"-- select a category --"
      });
      availableCategories();
    };

    $scope.updateBlog = function(blog){      
      $scope.blogAlerts = [];
      adminResource.updateBlog($scope.blog._id, blog).then(function(result){
        if(result.success){
          console.log(JSON.stringify(result));
          deserializeBlog(result.blog);
          $scope.blogAlerts.push({ type: 'info', msg: 'Changes have been saved.'});
        }else{
          angular.forEach(result.errors, function(err, index){
            $scope.blogAlerts.push({ type: 'danger', msg: err });
          });
        }
      }, function(x){
        $scope.blogAlerts.push({ type: 'danger', msg: 'Error updating account: ' + x });
      });
    };

    $scope.updateBlogModal = function(blog){
         ModalFactory.trigger(this, "updateBlog.html",'blog',function($uibModalInstance,topController){
            this.categories = topController.categories;
            this.data = blog;
            this.alerts = topController.blogAlerts;
            this.updateBlog = function(data){          
              console.log("data form", data.category);
              if(!angular.equals({}, data)){
                data.isPublished = (data.isPublished===true)?true:false;
                //topController.data = data;
                topController.updateBlog(data);
              }else{
                throw new Error('there is no parameter entered');
              }         
              //topController.addBlog();
              $uibModalInstance.close('OK');
            };

            this.cancel = function(){
              $uibModalInstance.dismiss('cancel');
            };

            this.close = function(ind){
              topController.closeBlogAlert(ind)
            };

            this.canSave = function(ngFormCtrl){              
                return  ngFormCtrl.$dirty && ngFormCtrl.$valid;
            }
      });
    };
    var availableCategories = function(){
      adminResource.findBlogCategories()
      .then((data)=>{
        if(!angular.equals({},data)){
          angular.forEach(data.data, (category)=>{
            $scope.categories.push(category);
         });
        }else{
          $scope.categories =["empty"];
        }
         
      });
        
    };

  var closeAlert = function(alert, ind){
    alert.splice(ind, 1);
  };
  $scope.closeBlogAlert = function(ind){
        closeAlert($scope.blogAlerts, ind);
  };
    deserializeData(data);
  }
]);