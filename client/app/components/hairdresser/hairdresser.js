import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserDirective} from './hairdresser.directive';

export const hairdresser = angular.module('hairdresser', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('hairdresser', {
      url: '/hairdresser',
      template: '<hairdresser></hairdresser>',
      resolve:{
      	access:["Access", function(Access){ return Access.isHairdresser(1);}]
      }
    })
  })
  .directive('hairdresser',hairdresserDirective)
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
  });

