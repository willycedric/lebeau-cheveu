import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {showhairdresserprofileDirective} from './showhairdresserprofile.directive';
export const showhairdresserprofile = angular.module('showhairdresserprofile', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('showhairdresserprofile', {
      url: '/showhairdresserprofile/:id',
      template: '<showhairdresserprofile></showhairdresserprofile>'
    })
  })
  .directive('showhairdresserprofile',showhairdresserprofileDirective)
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
          default:
          break;
    }
  }
});
