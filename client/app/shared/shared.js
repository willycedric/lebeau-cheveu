import {api} from './api';
import {posts} from './posts';
import {franceMap} from './franceMap';
import {userFactory} from './userFactory';
import {authFactory} from './authFactory';
import {AuthInterceptor} from './authInterceptor';
import {AuthToken} from './authToken';
import {UserProfile} from './userProfile';
import {Access} from './Access';
import {locationFactory} from './locationFactory';
import {hairdresserAccountManager} from './hairdresserAccountManager';
import {customerAccountManager} from './customerAccountManager';
import {searchBar} from './searchBar';
import {ModalFactory} from './modalFactory';
import {DateHandler} from './simpleDateHandler';
import {ZonePath} from './zonePath';
import {Formulator} from './formulator';
import {PhotoUploader} from './photoUploader';
import {HaircutCategoryFactory} from './haircutCategory';
import angular from 'angular';


export const shared = angular.module('shared', [])
  .constant('API', api)
  .factory('Posts', posts)
  .factory('Map', franceMap)
  .factory('User',userFactory)
  .factory('Auth',authFactory)
  .factory('AuthToken',AuthToken)
  .factory('AuthInterceptor',AuthInterceptor)
  .factory('UserProfile',UserProfile)
  .factory('Access',Access)
  .factory('Location',locationFactory)
  .factory('hairdresserMAnager',hairdresserAccountManager)
  .factory('customerMAnager',customerAccountManager)
  .factory('searchBar',searchBar)
  .factory('ModalFactory',ModalFactory)
  .factory('DateHandler',DateHandler)
  .factory('ZonePath',ZonePath)
  .factory('Formulator',Formulator)
  .factory('PhotoUploader',PhotoUploader)
  .factory('haircutCategory',HaircutCategoryFactory)
  .config(function($httpProvider){
  	$httpProvider.interceptors.push(AuthInterceptor);
  });


