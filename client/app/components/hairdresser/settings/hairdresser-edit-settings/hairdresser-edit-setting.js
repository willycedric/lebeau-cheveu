import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdressersettingsDirective} from './hairdresser-edit-setting.directive';
import {servicesHairdresserResourceModule} from './../../../common/services/hairdresserResource';
import template from './hairdresser-edit-setting.tpl.html';
import './hairdresser-edit-setting.scss';

export const hairdressersetting = angular.module('hairdressersettingsedit', [uiRouter,servicesHairdresserResourceModule.name])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdressersettingsedit', {
      url: '/hairdresser/settings/edit/',
      template:'<hairdressersettings></hairdressersettings>',
      params:{details:null}
    })
  })
  .directive('hairdressersettings',hairdressersettingsDirective)
  .directive('rangeValidator', ()=>{
    return{
  		require:'ngModel',
  		restrict:'A',
  		link:function(scope,element, attrs, ngModel){				 
  				ngModel.$validators.price = (value)=>{              
              var value = attrs.max >= value && attrs.min <= value;  						
              console.log("range-validator ", value);
              return value;
  				};
  		}
  	};
  });

