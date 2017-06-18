import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserDirective} from './hairdresser.directive';
import menu from './hairdresser-menu.html';
import {hairdresserlogbook} from './logbook/hairdresserlogbook';
import {hairdressermessage} from './messages/hairdressermessage';
import {hairdresserbooking} from './bookings/hairdresserbooking';
import {hairdresserpicture} from './pictures/hairdresserpicture';
import {hairdresseraccount} from './settings/hairdresseraccount';
import {hairdresserVerificationModule} from './verification/hairdresser-verification';
import {hairdresserdescription} from './settings/hairdresser-edit-description/hairdresser-edit-description';
import {hairdresserarea} from './settings/hairdresser-edit-area/hairdresser-edit-area';
import {hairdressersetting} from './settings/hairdresser-edit-settings/hairdresser-edit-setting';
import {servicesHairdresserResourceModule} from './../common/services/hairdresserResource';
import {securityAuthorizationModule} from './../common/security/authorization';
import hairdresserProfileCard from './haidresser-profile-card.html';
import {HairdresserController as controller} from './hairdresser.controller';
import template from './hairdresser.html';
import './hairdresser.css';
import './hairdresser.scss';
import './hairdresser-profile-card.css';
export const hairdresser = angular.module('hairdresser', 
    [
      uiRouter,
      securityAuthorizationModule.name,
      hairdresserlogbook.name,
      hairdressermessage.name,
      hairdresserbooking.name,
      hairdresserpicture.name,
      hairdresseraccount.name,
      hairdresserdescription.name,
      hairdresserarea.name,
      hairdressersetting.name,
      servicesHairdresserResourceModule.name,
      hairdresserVerificationModule.name
    ]
  )
  .config(($stateProvider,securityAuthorizationProvider) => {
    $stateProvider.state('hairdresser', {
      url: '/hairdresser',
      template,
      controller,
      resolve: {
        summaries: ['$q', '$window', 'securityAuthorization', 'hairdresserResource','$state',function($q, $window, securityAuthorization,hairdresserResource, $state){
          //get app stats only for admin-user, otherwise redirect to /account
          //var redirectUrl;          
          var promise = securityAuthorization.requireHairdresserUser()
            .then(hairdresserResource.getSettings, function(reason){
                //rejected either user is unverified or un-authenticated               
               // redirectUrl = reason === 'unverified-client'?'/hairdresser/verification': '/login';                
                return $q.reject();
              })
              .finally(function(){               
               $state.go('hairdresserverification');
                return $q.reject();
              });
                return promise;
        }]
      }
    })
  })
  .directive('hairdresser',hairdresserDirective)
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
  .directive('hairdresserMenu',()=>{
    return {
      restrict:'E',
      template:menu,
      replace:true
    };
  })
  .filter('accountstatus', ()=>{
    return (accountstatus)=>{
      if(accountstatus ==1){
        return 'actif';
      }else if(accountstatus == 0){
          return 'désactivé';
      }else{
        return 'inconnu';
      }
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

