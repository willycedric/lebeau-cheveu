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
  .config(function($httpProvider){
  	$httpProvider.interceptors.push(AuthInterceptor);
  });


