import {api} from './api';
import {posts} from './posts';
import {franceMap} from './franceMap';
import {userFactory} from './userFactory';
import {authFactory} from './authFactory';
import {AuthInterceptor} from './authInterceptor';
import {AuthToken} from './authToken';
import {UserProfile} from './userProfile';
import {Access} from './Access';
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
  .config(function($httpProvider){
  	$httpProvider.interceptors.push(AuthInterceptor);
  });


