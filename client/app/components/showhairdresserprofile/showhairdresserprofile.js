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
.filter('customerTypeFilter',()=>{
    return (typeId)=>{
      switch(typeId){
        case 0:
          return "Mixte";
        break;
        case 1:
          return "Femme uniquement";
        break;
        case 2:
          return "Homme uniquement";
        break;
        default:
        break;
      }
    }
})
.filter('displayHairdresserStatut', () =>{
  return (status)=>{
    switch(status){
      case 0:
        return 'Dispo';
        break;
      case 1:
        return 'Réservé';
        break;
      case -1:
        return 'Vérouillé'
        break;
      default:
        break;
    }
  }
});
