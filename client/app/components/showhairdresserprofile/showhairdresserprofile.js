import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {showhairdresserprofileDirective} from './showhairdresserprofile.directive';
import hairdresserProfileCard from './haidresser-profile-card.html';
import './hairdresser-profile-card.css';

export const showhairdresserprofile = angular.module('showhairdresserprofile', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('showhairdresserprofile', {
      url: '/showhairdresserprofile/:id',
      template: '<showhairdresserprofile></showhairdresserprofile>'
    })
  })
  .directive('showhairdresserprofile',showhairdresserprofileDirective)
  .directive('hairdresserProfileCard', () =>{
    return{
      restrict:'E',
      template:hairdresserProfileCard,
      scope:{
        url:'@',
        name:'@',
        type:'@'
      },
      replace:true,
    };
})

