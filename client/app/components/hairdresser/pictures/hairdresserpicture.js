import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {hairdresserpictureDirective} from './hairdresserpicture.directive';
import {servicesHairdresserResourceModule} from './../../common/services/hairdresserResource';
import './hairdresserpicture.css';
import {HairdresserpictureController as controller} from './hairdresserpicture.controller';
import template from './hairdresserpicture-catalogs.html';
import './hairdresserpicture.scss';
import {hairdresserHaircutCatalogModule}  from './hairdresser-catalog';

export const hairdresserpicture = angular.module('hairdresserpicture', [uiRouter,servicesHairdresserResourceModule.name,
  hairdresserHaircutCatalogModule.name])
  .config(($stateProvider, securityAuthorizationProvider) => {
    $stateProvider.state('hairdresserpicture', {
      url: '/hairdresser/pictures',
      template,
      controller,
      controllerAs:'vm',
      resolve: {
        pictures: ['$q', '$location', 'securityAuthorization','hairdresserResource', function($q, $location, securityAuthorization,hairdresserResource){
          //get app stats only for admin-user, otherwise redirect to /account
          var redirectUrl;
          var promise = securityAuthorization.requireHairdresserUser()
            .then(hairdresserResource.getSettings, function(reason){
                //rejected either user is unverified or un-authenticated
                redirectUrl = reason === 'unverified-client'? '/account/verification': '/login';
                return $q.reject();
              })
              .catch(function(){
                redirectUrl = redirectUrl || '/hairdresser';
                $location.path(redirectUrl);
                return $q.reject();
              });
                return promise;
        }]
      }
    })
  })
  .directive('hairdresserpicture',hairdresserpictureDirective);

