

import {servicesAdminResourceModule} from './../../common/services/adminResource';
import{securityAuthorizationModule} from './../../common/security/authorization';
import {servicesUtilityModule} from './../../common/services/utility';
import uiRouter from 'angular-ui-router';
import template from './admin-gallerys.tpl.html';
import moment from 'moment';
import './admin-gallery.scss';
angular.module('admingallerysIndexModule', [uiRouter,
  securityAuthorizationModule.name,
  servicesUtilityModule.name, 
  servicesAdminResourceModule.name
]);
angular.module('admingallerysIndexModule').config(['$stateProvider', function($stateProvider){
  $stateProvider
    .state('admingallery', {
      url:'/admin/gallerys',
      template,
      controller: 'gallerysIndexCtrl',
      title: 'Manage gallerys',
      resolve: {
        gallerys: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
          //get app stats only for admin-user, otherwise redirect to /gallery
          var redirectUrl;
          var promise = securityAuthorization.requireAdminUser()
            .then(function(){
              //handles url with query(search) parameter
              return adminResource.getGalleyEntries($location.search());
            }, function(reason){
              //rejected either user is un-authorized or un-authenticated
              redirectUrl = reason === 'unauthorized-client'? '/gallery': '/login';
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/gallery';
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
export const admingallerysIndexModule = angular.module('admingallerysIndexModule').controller('gallerysIndexCtrl', ['$scope', '$route', '$location', '$log', 'adminResource', 'gallerys','ModalFactory','$window',
  function($scope, $route, $location, $log, adminResource, data, ModalFactory, $window){

    $scope.isSelected = []; // toggle to entry selected animation
    $scope.isAlreadySelected =[];
    var deserializeData = function(data){      
       $scope.galleryEntries = data;      
       for(var i=0; i< $scope.galleryEntries.length;i++){
          $scope.isSelected[i]=false;
           $scope.isAlreadySelected[i] = false
       }
       adminResource.getHomeGalleryEntry()
       .then( (rep ) => {         
          $scope.persistedEntries = rep.results.data;
          //first check if the homeGalleryEntries already contains the entry and the entry state is set to true
           var galeryUrl =  $scope.persistedEntries.map( (elt) => {
              return elt.url;
            });
          angular.forEach(galeryUrl, ( url, index ) => {
              if( $scope.galleryEntries.map( (elt )  => {                
                return elt.entry.url;
            }).indexOf(url) !=-1 &&  $scope.persistedEntries[index].state ){                
               $scope.isAlreadySelected[index]=true;
            }else if(!$scope.persistedEntries[index].state){              
              $scope.galleryEntries[$scope.galleryEntries.map(function(gal){
                return gal.entry.url;
              }).indexOf(url)].state= false;
            }
        });
         $scope.galleryEntries =  $scope.galleryEntries.filter( (elt )=>{
            return !elt.hasOwnProperty("state");
         });
       
       }, (err) => {
         console.error(err.toString());
       });      
       
    };    

    
    $scope.updateSelection = function(index){
      $scope.isSelected[index] =!$scope.isSelected[index];
    }

     $scope.selectedEntries = [];//array containing the entries selected by the admin user   
    $scope.entrySelected = function(url, category, index) {       
      var data = {
        url,
        category
      }   
   
      //if the element selected is already contained in the array remove it 
      if(  $scope.selectedEntries.length > 0 ){
       if( $scope.selectedEntries.map(function(elt){
          return elt.url;
        }).indexOf(url)!=-1)
        {
             $scope.selectedEntries.splice( $scope.selectedEntries.indexOf(  $scope.selectedEntries.map(function(elt){
              return elt.category;
            }).indexOf(category) ));  
        }else if($scope.selectedEntries.map(function(elt){
          return elt.category
        }).indexOf(category)!=-1){
          //an element has already been added for that category
          //TODO -> inform the user
          $scope.updateSelection(index);
        }
        else{
          //Add the selected entry
          $scope.selectedEntries.push(data);
        }
      }else{
         $scope.selectedEntries.push(data);
      }      
      data = {};      
    };

    //Persist the selected entries in the database
    //TODO limit the selection to three items.
    $scope.saveSelectedEntries = function(){         
      var contents = $scope.selectedEntries.map((elt) => {
          return elt.url;
      }); //return an array containing entry url

      adminResource.createHomeGalleryEntry(contents)
      .then( (results) => {
        $window.location.reload();
        //TODO display confirmation message
      }, (error) => {
        console.error(error.toString());
        //TODO display error message
      });
    }

    //allows to sort all the entries by creation date
    $scope.sortEntry = function( entry ) {
        var date = new Date(entry.created);
        return date;
    };
    
   //update the state of the entry to from true to false
   //TODO give the choice to the admin user on whether the 'state' value should be set to true or false.
   $scope.unpublish = function(index){
      if($scope.isAlreadySelected[ $scope.alreadySelected(index)]){
        if(confirm("voulez depublier cette photo ?")){
          adminResource.updateHomeGalleryEntry( $scope.persistedEntries[ $scope.alreadySelected(index)]._id)
          .then( (rep) => {
            $window.location.reload();
          },(err) => {
            console.error(err.toString());
          });
        } 
      }   
    };

   //check whether the entry selected is already contained in the persisted entries
   $scope.alreadySelected = function (url) {
      if($scope.persistedEntries){
          var test = $scope.persistedEntries.map( ( elt ) => {
              return elt.url;
            }).indexOf(url);       
            return test;
      }    
    }    

    //initialize $scope variables
    deserializeData(data);

  }
]);